import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

/**
 * Central server-side AI configuration
 *
 * IMPORTANT:
 * - AI_API_KEY must stay server-side.
 * - Never expose it through NEXT_PUBLIC_* variables.
 */
export const AI_CONFIG = {
  apiKey: process.env.AI_API_KEY || '',
  baseURL: process.env.AI_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  model: process.env.AI_MODEL || 'z-ai/glm-5-3-flash',
  geminiKey: process.env.GEMINI_API_KEY || '',

  // Keep the request bounded so the frontend never waits forever.
  timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '60000', 10),
};

/**
 * Normalize the NVIDIA base URL.
 *
 * Expected:
 * https://integrate.api.nvidia.com/v1
 *
 * Final endpoint:
 * https://integrate.api.nvidia.com/v1/chat/completions
 */
export function sanitizeBaseUrl(rawUrl?: string): string {
  let url = (rawUrl || process.env.AI_BASE_URL || AI_CONFIG.baseURL).trim();

  url = url.replace(/\/+$/, '');

  // Prevent accidental duplicate endpoint.
  url = url.replace(/\/chat\/completions$/, '');

  // If /v1 was omitted, add it.
  if (url === 'https://integrate.api.nvidia.com') {
    url = 'https://integrate.api.nvidia.com/v1';
  }

  return url;
}

/**
 * Resolve the NVIDIA hosted model ID.
 *
 * NVIDIA's current hosted API uses:
 * z-ai/glm-5.3-flash
 *
 * We still allow the environment to contain:
 * z-ai/glm-5-3-flash
 *
 * and normalize it here.
 */
export function resolveModelId(rawModel?: string): string {
  const model = (rawModel || process.env.AI_MODEL || AI_CONFIG.model).trim();

  if (model === 'z-ai/glm-5-3-flash') {
    return 'z-ai/glm-5.3-flash';
  }

  return model;
}

/**
 * Safe JSON parser.
 *
 * Handles:
 * - normal JSON
 * - ```json fenced JSON
 * - ``` fenced JSON
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
    console.warn(
      '[AI Engine] Failed to parse JSON cleanly, attempting extraction:',
      err?.message
    );

    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      } catch {
        // Continue to fallback / throw below.
      }
    }

    if (fallback !== undefined) {
      return fallback;
    }

    throw err;
  }
}

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletionOptions {
  systemPrompt: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  responseFormat?: 'json' | 'text';
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

/**
 * Universal server-side AI execution engine.
 *
 * Primary:
 * NVIDIA NIM / OpenAI-compatible API
 *
 * Endpoint:
 * POST https://integrate.api.nvidia.com/v1/chat/completions
 *
 * Model:
 * z-ai/glm-5.3-flash
 */
export async function generateAstrologyCompletion(
  options: AiCompletionOptions
): Promise<string> {
  const {
    systemPrompt,
    messages,
    responseFormat = 'text',

    // NVIDIA's documented default temperature is 0.5.
    // Slightly lower temperature keeps astrology synthesis consistent.
    temperature = 0.5,

    // Keep output bounded for interactive readings.
    maxTokens = 1400,
  } = options;

  const apiKey = (process.env.AI_API_KEY || AI_CONFIG.apiKey).trim();

  const rawBaseURL =
    process.env.AI_BASE_URL || AI_CONFIG.baseURL;

  const baseURL = sanitizeBaseUrl(rawBaseURL);

  const rawModel =
    process.env.AI_MODEL || AI_CONFIG.model;

  const targetModel = resolveModelId(rawModel);

  const geminiKey =
    (process.env.GEMINI_API_KEY || AI_CONFIG.geminiKey).trim();

  const timeoutMs =
    options.timeoutMs || AI_CONFIG.timeoutMs;

  console.log('[LD-4] AI request starting');

  // ---------------------------------------------------------
  // 1. NVIDIA NIM
  // ---------------------------------------------------------

  if (apiKey) {
    const client = new OpenAI({
      apiKey,
      baseURL,

      // OpenAI SDK timeout.
      timeout: timeoutMs,

      // Do not automatically retry slow/failed requests.
      maxRetries: 0,
    });

    const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: 'system',
          content: systemPrompt,
        },

        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ];

    const endpoint = `${baseURL}/chat/completions`;

    console.log('[LD-5] NVIDIA request starting', {
      endpoint,
      model: targetModel,
      timeoutMs,
      messageCount: apiMessages.length,
      systemPromptLength: systemPrompt.length,
    });

    const abortController = new AbortController();

    const timeoutHandle = setTimeout(() => {
      abortController.abort();
    }, timeoutMs);

    const requestStartedAt = Date.now();

    try {
      /**
       * GLM-5.3-Flash:
       *
       * reasoning_effort defaults to max.
       * For an interactive astrology reading we explicitly use low
       * so the request does not spend excessive time reasoning.
       *
       * clear_thinking is passed through NVIDIA's extra body fields
       * so only the final answer is returned to the application.
       */
      const completion =
        await client.chat.completions.create(
          {
            model: targetModel,

            messages: apiMessages,

            temperature,

            max_tokens: Math.min(maxTokens, 1400),

            // Important for GLM-5.3-Flash latency.
            reasoning_effort: 'low',

            // Keep the request non-streaming because this function
            // expects one complete response.
            stream: false,

            ...(responseFormat === 'json'
              ? {
                  response_format: {
                    type: 'json_object',
                  },
                }
              : {}),

            /**
             * NVIDIA/Z.ai chat-template option.
             * This prevents reasoning content from being treated
             * as the final user-facing astrology answer.
             */
            extra_body: {
              chat_template_kwargs: {
                clear_thinking: true,
              },
            },
          } as any,
          {
            timeout: timeoutMs,
            signal: abortController.signal,
          }
        );

      const elapsedMs = Date.now() - requestStartedAt;

      console.log('[LD-6] NVIDIA response received', {
        status: 200,
        elapsedMs,
      });

      const responseText =
        completion.choices?.[0]?.message?.content || '';

      if (!responseText.trim()) {
        throw new Error(
          'NVIDIA returned an empty response'
        );
      }

      console.log('[LD-7] AI response parsed', {
        characters: responseText.length,
      });

      return responseText;
    } catch (err: any) {
      const elapsedMs = Date.now() - requestStartedAt;

      const errorMessage =
        err?.message || String(err);

      const lowerMessage =
        errorMessage.toLowerCase();

      const isTimeout =
        err?.name === 'AbortError' ||
        err?.name === 'APIConnectionTimeoutError' ||
        lowerMessage.includes('timed out') ||
        lowerMessage.includes('timeout') ||
        err?.status === 408 ||
        err?.status === 504;

      const httpStatus = isTimeout
        ? 504
        : err?.status ||
          err?.statusCode ||
          500;

      const errorBody =
        err?.error ||
        err?.response?.data ||
        err?.body ||
        errorMessage ||
        null;

      console.error(
        '[AI Engine Error - NVIDIA NIM]',
        {
          provider: baseURL,
          endpoint,
          model: targetModel,
          status: httpStatus,
          elapsedMs,
          message: errorMessage,
          errorBody,
        }
      );

      // -----------------------------------------------------
      // NVIDIA timed out
      // -----------------------------------------------------

      if (isTimeout) {
        console.warn(
          `[AI Engine] NVIDIA request timed out after ${elapsedMs}ms`
        );

        if (!geminiKey) {
          const timeoutErr: any = new Error(
            'Astrological analysis took too long. Please try again.'
          );

          timeoutErr.status = 504;

          throw timeoutErr;
        }
      }

      // -----------------------------------------------------
      // NVIDIA 404
      // -----------------------------------------------------

      else if (httpStatus === 404) {
        /**
         * Try the original environment model only if the
         * normalized model produced a 404.
         *
         * This is kept as a compatibility fallback.
         */
        const alternateModel =
          targetModel === rawModel
            ? resolveModelId(rawModel)
            : rawModel.trim();

        if (
          alternateModel &&
          alternateModel !== targetModel
        ) {
          console.warn(
            `[AI Engine] 404 for "${targetModel}". Trying "${alternateModel}".`
          );

          try {
            const retryStartedAt = Date.now();

            const retryCompletion =
              await client.chat.completions.create(
                {
                  model: alternateModel,

                  messages: apiMessages,

                  temperature,

                  max_tokens: Math.min(
                    maxTokens,
                    1400
                  ),

                  reasoning_effort: 'low',

                  stream: false,

                  ...(responseFormat === 'json'
                    ? {
                        response_format: {
                          type: 'json_object',
                        },
                      }
                    : {}),

                  extra_body: {
                    chat_template_kwargs: {
                      clear_thinking: true,
                    },
                  },
                } as any,
                {
                  timeout: timeoutMs,
                }
              );

            const retryElapsed =
              Date.now() - retryStartedAt;

            console.log(
              '[LD-6] NVIDIA alternate response received',
              {
                status: 200,
                elapsedMs: retryElapsed,
                model: alternateModel,
              }
            );

            const retryText =
              retryCompletion.choices?.[0]?.message
                ?.content || '';

            if (retryText.trim()) {
              return retryText;
            }
          } catch (retryErr: any) {
            console.error(
              '[AI Engine Alternate Model Error]',
              {
                provider: baseURL,
                model: alternateModel,
                status:
                  retryErr?.status ||
                  retryErr?.statusCode ||
                  500,
                message: retryErr?.message,
                errorBody:
                  retryErr?.error ||
                  retryErr?.response?.data ||
                  retryErr?.body ||
                  null,
              }
            );
          }
        }
      }

      // -----------------------------------------------------
      // Optional Gemini fallback
      // -----------------------------------------------------

      if (!geminiKey) {
        const customErr: any = new Error(
          isTimeout
            ? 'Astrological analysis took too long. Please try again.'
            : 'Your astrologer is temporarily unavailable. Please try again in a moment.'
        );

        customErr.status = httpStatus;

        throw customErr;
      }

      console.warn(
        '[AI Engine] NVIDIA failed. Trying Gemini fallback.'
      );
    } finally {
      clearTimeout(timeoutHandle);
    }
  }

  // ---------------------------------------------------------
  // 2. Gemini fallback
  // ---------------------------------------------------------

  if (geminiKey) {
    try {
      console.log(
        '[AI Fallback] Starting Gemini fallback'
      );

      const gClient = new GoogleGenAI({
        apiKey: geminiKey,
      });

      const fullPrompt = [
        systemPrompt,
        ...messages.map(
          (message) =>
            `${
              message.role === 'user'
                ? 'Querent'
                : 'Acharya Arya'
            }: ${message.content}`
        ),
      ].join('\n\n');

      /**
       * Keep this list conservative.
       *
       * The fallback should not add several minutes of
       * sequential waiting after NVIDIA has already failed.
       */
      const candidateModels = [
        'gemini-3.5-flash',
        'gemini-3.6-flash',
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
      ];

      let lastErr: any = null;

      for (const candidateModel of candidateModels) {
        try {
          const perModelTimeout = 15000;

          const fallbackTimeout =
            new Promise<never>((_, reject) => {
              setTimeout(
                () =>
                  reject(
                    new Error(
                      `${candidateModel} timed out after 15s`
                    )
                  ),
                perModelTimeout
              );
            });

          const generation =
            gClient.models.generateContent({
              model: candidateModel,
              contents: fullPrompt,
              config: {
                responseMimeType:
                  responseFormat === 'json'
                    ? 'application/json'
                    : 'text/plain',

                temperature,
              },
            });

          const res = await Promise.race([
            generation,
            fallbackTimeout,
          ]);

          const text = res.text || '';

          if (text.trim()) {
            console.log(
              '[LD-6] Gemini fallback response received',
              {
                model: candidateModel,
              }
            );

            return text;
          }

          throw new Error(
            `${candidateModel} returned empty content`
          );
        } catch (modelErr: any) {
          console.warn(
            `[AI Fallback] ${candidateModel} failed:`,
            modelErr?.message?.slice(0, 150)
          );

          lastErr = modelErr;
        }
      }

      throw (
        lastErr ||
        new Error(
          'All fallback AI models failed to return content'
        )
      );
    } catch (err: any) {
      console.error(
        '[AI Engine Error - Gemini Fallback]:',
        err?.message || err
      );

      throw new Error(
        'Your astrologer is temporarily unavailable. Please try again in a moment.'
      );
    }
  }

  // ---------------------------------------------------------
  // 3. No provider configured
  // ---------------------------------------------------------

  throw new Error(
    'No AI API key configured. Please set AI_API_KEY in your environment.'
  );
}
