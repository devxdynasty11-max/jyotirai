import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Central server-side configuration
export const AI_CONFIG = {
  apiKey: process.env.AI_API_KEY || '',
  baseURL: process.env.AI_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  model: process.env.AI_MODEL || 'z-ai/glm-5-3-flash',
  geminiKey: process.env.GEMINI_API_KEY || '',
  timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '65000', 10), // 65 seconds server timeout (60-90s window)
};

/**
 * Sanitizes base URL to prevent /v1/v1, /chat/completions/chat/completions, or missing /v1
 */
export function sanitizeBaseUrl(rawUrl?: string): string {
  let url = (rawUrl || process.env.AI_BASE_URL || AI_CONFIG.baseURL).trim();
  // Strip trailing slashes
  url = url.replace(/\/+$/, '');
  // If user accidentally included /chat/completions in AI_BASE_URL, strip it
  url = url.replace(/\/chat\/completions$/, '');
  // If user provided https://integrate.api.nvidia.com without /v1, append /v1
  if (url === 'https://integrate.api.nvidia.com') {
    url = 'https://integrate.api.nvidia.com/v1';
  }
  return url;
}

/**
 * Resolves model ID for NVIDIA NIM catalog.
 * In NVIDIA's hosted catalog, the model ID is registered with a dot: "z-ai/glm-5.3-flash".
 * If the environment specifies "z-ai/glm-5-3-flash" (hyphenated), map it to the registered ID
 * to prevent 404 route matching errors on NVIDIA's ingress router.
 */
export function resolveModelId(rawModel?: string): string {
  const model = (rawModel || process.env.AI_MODEL || AI_CONFIG.model).trim();
  if (model === 'z-ai/glm-5-3-flash') {
    return 'z-ai/glm-5.3-flash';
  }
  return model;
}

/**
 * Safe JSON parser that removes markdown fences if emitted by the model
 */
export function safeParseJson<T = any>(rawText: string, fallback?: T): T {
  try {
    let clean = (rawText || '').trim();
    if (clean.startsWith('```json')) {
      clean = clean.slice(7);
    } else if (clean.startsWith('```')) {
      clean = clean.slice(3);
    }
    if (clean.endsWith('```')) {
      clean = clean.slice(0, -3);
    }
    clean = clean.trim();
    return JSON.parse(clean);
  } catch (err: any) {
    console.warn('[AI Engine] Failed to parse JSON cleanly, attempting extraction:', err.message);
    // Attempt to extract outermost JSON object { ... }
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      } catch (nestedErr) {}
    }
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletionOptions {
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  responseFormat?: 'json' | 'text';
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

/**
 * Universal server-side AI execution engine
 * Dispatches to configured NVIDIA NIM / OpenAI-compatible endpoint,
 * with strict [LD-4], [LD-5], [LD-6] tracing and bounded AbortSignal timeout.
 */
export async function generateAstrologyCompletion(options: AiCompletionOptions): Promise<string> {
  const { systemPrompt, messages, responseFormat = 'text', temperature = 0.7, maxTokens = 2000 } = options;

  // Re-read environment dynamically in case credentials were set at runtime
  const apiKey = (process.env.AI_API_KEY || AI_CONFIG.apiKey).trim();
  const rawBaseURL = process.env.AI_BASE_URL || AI_CONFIG.baseURL;
  const baseURL = sanitizeBaseUrl(rawBaseURL);
  const rawModel = process.env.AI_MODEL || AI_CONFIG.model;
  const targetModel = resolveModelId(rawModel);
  const geminiKey = (process.env.GEMINI_API_KEY || AI_CONFIG.geminiKey).trim();
  const timeoutMs = options.timeoutMs || AI_CONFIG.timeoutMs;

  console.log('[LD-4] AI request starting');

  // 1. Try NVIDIA NIM / OpenAI-compatible API first
  if (apiKey) {
    const client = new OpenAI({
      apiKey,
      baseURL,
      timeout: timeoutMs,
      maxRetries: 0,
    });

    const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ];

    console.log('[LD-5] NVIDIA request sent', {
      baseURL,
      endpoint: `${baseURL}/chat/completions`,
      configuredModel: rawModel,
      effectiveModel: targetModel,
      timeoutMs,
    });

    const abortController = new AbortController();
    const timeoutHandle = setTimeout(() => {
      abortController.abort(new Error(`NVIDIA NIM request timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);

    try {
      const completion = await client.chat.completions.create(
        {
          model: targetModel,
          messages: apiMessages,
          temperature,
          max_tokens: maxTokens,
          ...(responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {}),
        },
        {
          timeout: timeoutMs,
          signal: abortController.signal,
        }
      );

      console.log('[LD-6] NVIDIA response received', { status: 200 });

      const responseText = completion.choices[0]?.message?.content || '';
      if (!responseText.trim()) {
        throw new Error('Received empty response from AI provider');
      }

      return responseText;
    } catch (err: any) {
      const isTimeout =
        err.name === 'AbortError' ||
        err.name === 'APIConnectionTimeoutError' ||
        err.message?.toLowerCase().includes('timed out') ||
        err.message?.toLowerCase().includes('timeout') ||
        err.status === 408 ||
        err.status === 504;

      const httpStatus = isTimeout ? 504 : (err.status || err.statusCode || 500);
      const errorBody = err.error || err.response?.data || err.body || err.message || null;

      console.error('[AI Engine Error - OpenAI/NVIDIA NIM]:', {
        provider: baseURL,
        model: targetModel,
        status: httpStatus,
        message: err.message,
        errorBody,
      });

      // If it timed out, do not burn more time with alternate model retries
      if (isTimeout) {
        if (geminiKey) {
          console.warn('[AI Engine] Primary provider timed out, attempting fast fallback...');
        } else {
          const timeoutErr: any = new Error(`Astrological analysis timed out after ${timeoutMs / 1000} seconds.`);
          timeoutErr.status = 504;
          throw timeoutErr;
        }
      } else if (httpStatus === 404) {
        // If 404 occurred and we used a transformed model, or if the original model differed, retry with the alternate ID
        const alternateModel = targetModel === rawModel ? resolveModelId(rawModel) : rawModel.trim();
        if (alternateModel && alternateModel !== targetModel) {
          console.warn(`[AI Engine] 404 received for model "${targetModel}". Retrying with alternate model ID: "${alternateModel}"...`);
          try {
            console.log('[LD-5] NVIDIA request sent (alternate model retry)', { model: alternateModel });
            const retryCompletion = await client.chat.completions.create(
              {
                model: alternateModel,
                messages: apiMessages,
                temperature,
                max_tokens: maxTokens,
                ...(responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {}),
              },
              {
                timeout: timeoutMs,
              }
            );

            console.log('[LD-6] NVIDIA response received', { status: 200, alternate: true });

            const retryText = retryCompletion.choices[0]?.message?.content || '';
            if (retryText.trim()) {
              return retryText;
            }
          } catch (retryErr: any) {
            console.error('[AI Engine Retry Error - OpenAI/NVIDIA NIM]:', {
              provider: baseURL,
              model: alternateModel,
              status: retryErr.status || retryErr.statusCode || 500,
              message: retryErr.message,
              errorBody: retryErr.error || retryErr.response?.data || retryErr.body || null,
            });
          }
        }
      }

      // If fallback key exists and primary failed, attempt fallback
      if (geminiKey) {
        console.warn('[AI Engine] Primary provider failed, attempting AI fallback...');
      } else {
        const customErr: any = new Error(
          isTimeout
            ? 'Astrological analysis took too long. Please try again.'
            : 'Your astrologer is temporarily unavailable. Please try again in a moment.'
        );
        customErr.status = httpStatus;
        throw customErr;
      }
    } finally {
      clearTimeout(timeoutHandle);
    }
  }

  // 2. Resilient Fast AI Fallback (e.g. Gemini)
  if (geminiKey) {
    try {
      console.log('[LD-5] NVIDIA request sent (fallback AI provider)');
      const gClient = new GoogleGenAI({ apiKey: geminiKey });
      const fullPrompt = `${systemPrompt}\n\n${messages.map(m => `${m.role === 'user' ? 'Querent' : 'Acharya Arya'}: ${m.content}`).join('\n\n')}`;

      // Fast, active flash models in optimal priority
      const candidateModels = [
        'gemini-3.5-flash',
        'gemini-3.6-flash',
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
      ];
      let lastErr: any = null;

      for (const candidateModel of candidateModels) {
        try {
          const perModelTimeout = 18000; // 18 seconds max per model to prevent client timeouts
          const res = await Promise.race([
            gClient.models.generateContent({
              model: candidateModel,
              contents: fullPrompt,
              config: {
                responseMimeType: responseFormat === 'json' ? 'application/json' : 'text/plain',
                temperature,
              },
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`${candidateModel} timed out after 18s`)), perModelTimeout)
            ),
          ]);

          const text = res.text || '';
          if (text.trim()) {
            console.log('[LD-6] NVIDIA response received', { fallbackModel: candidateModel });
            return text;
          }
        } catch (mErr: any) {
          console.warn(`[AI Fallback] ${candidateModel} failed:`, mErr.message?.slice(0, 100));
          lastErr = mErr;
        }
      }

      throw lastErr || new Error('All AI models failed to return content');
    } catch (err: any) {
      console.error('[AI Engine Error - Fallback]:', err.message);
      throw new Error('Your astrologer is temporarily unavailable. Please try again in a moment.');
    }
  }

  throw new Error('No AI API key configured. Please set AI_API_KEY in your environment.');
}
