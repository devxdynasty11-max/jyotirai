import dotenv from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Central server-side configuration
export const AI_CONFIG = {
  apiKey: process.env.AI_API_KEY || '',
  baseURL: process.env.AI_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  model: process.env.AI_MODEL || 'z-ai/glm-5.3-flash',
  geminiKey: process.env.GEMINI_API_KEY || '',
};

let openaiClient: OpenAI | null = null;
if (AI_CONFIG.apiKey) {
  openaiClient = new OpenAI({
    apiKey: AI_CONFIG.apiKey,
    baseURL: AI_CONFIG.baseURL,
  });
}

let geminiClient: GoogleGenAI | null = null;
if (AI_CONFIG.geminiKey) {
  geminiClient = new GoogleGenAI({ apiKey: AI_CONFIG.geminiKey });
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
}

/**
 * Universal server-side AI execution engine
 * Dispatches to configured NVIDIA NIM / OpenAI-compatible endpoint,
 * with graceful fallback to Gemini if AI_API_KEY is not yet entered.
 */
export async function generateAstrologyCompletion(options: AiCompletionOptions): Promise<string> {
  const { systemPrompt, messages, responseFormat = 'text', temperature = 0.7, maxTokens = 2500 } = options;

  // Re-read environment dynamically in case credentials were set at runtime
  const apiKey = process.env.AI_API_KEY || AI_CONFIG.apiKey;
  const baseURL = process.env.AI_BASE_URL || AI_CONFIG.baseURL;
  const model = process.env.AI_MODEL || AI_CONFIG.model;
  const geminiKey = process.env.GEMINI_API_KEY || AI_CONFIG.geminiKey;

  // 1. Try NVIDIA NIM / OpenAI-compatible API first
  if (apiKey) {
    try {
      const client = new OpenAI({ apiKey, baseURL });
      const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ];

      const completion = await client.chat.completions.create({
        model,
        messages: apiMessages,
        temperature,
        max_tokens: maxTokens,
        ...(responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {}),
      });

      const responseText = completion.choices[0]?.message?.content || '';
      if (!responseText.trim()) {
        throw new Error('Received empty response from AI provider');
      }
      return responseText;
    } catch (err: any) {
      console.error('[AI Engine Error - OpenAI/NVIDIA NIM]:', {
        message: err.message,
        status: err.status,
        code: err.code,
        provider: baseURL,
        model,
      });

      // If fallback gemini key exists and primary failed, attempt fallback
      if (geminiKey) {
        console.warn('[AI Engine] Falling back to secondary provider...');
      } else {
        throw new Error('Your astrologer is temporarily unavailable. Please try again in a moment.');
      }
    }
  }

  // 2. Fallback to Gemini if configured
  if (geminiKey) {
    try {
      const gClient = new GoogleGenAI({ apiKey: geminiKey });
      const fullPrompt = `${systemPrompt}\n\n${messages.map(m => `${m.role === 'user' ? 'Querent' : 'Acharya Arya'}: ${m.content}`).join('\n\n')}`;

      const res = await gClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          responseMimeType: responseFormat === 'json' ? 'application/json' : 'text/plain',
          temperature,
        },
      });

      const text = res.text || '';
      if (!text.trim()) {
        throw new Error('Received empty response from Gemini');
      }
      return text;
    } catch (err: any) {
      console.error('[AI Engine Error - Gemini Fallback]:', err.message);
      throw new Error('Your astrologer is temporarily unavailable. Please try again in a moment.');
    }
  }

  throw new Error('No AI API key configured. Please set AI_API_KEY in your environment.');
}
