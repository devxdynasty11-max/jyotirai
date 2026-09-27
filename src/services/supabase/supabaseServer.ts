import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { VedicChartData, BirthDetails, AstrologerMessage } from '../astrology/types.ts';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export let supabaseAdmin: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
    console.log('[Supabase Server] Connected successfully to:', supabaseUrl);
  } catch (err: any) {
    console.warn('[Supabase Server] Initialization error:', err.message);
  }
} else {
  console.log('[Supabase Server] Credentials not yet provided. Operating with in-memory persistence layer.');
}

// In-memory fallback layer for seamless operation when Supabase keys are not set
const memoryStore = {
  users: new Map<string, any>(),
  charts: new Map<string, any>(),
  conversations: new Map<string, any[]>(),
  messages: new Map<string, any[]>(),
  savedReadings: new Map<string, any[]>(),
};

/**
 * Persist or update user birth details and calculated chart in Supabase
 */
export async function persistChartRecord(userId: string, chart: VedicChartData) {
  if (supabaseAdmin) {
    try {
      // 1. Insert or update birth details
      const { data: birthRecord, error: birthErr } = await supabaseAdmin
        .from('birth_details')
        .upsert({
          name: chart.birthDetails.name,
          preferred_name: chart.birthDetails.preferredName || null,
          birth_date: chart.birthDetails.birthDate,
          birth_time: chart.birthDetails.birthTime,
          is_time_unknown: chart.birthDetails.isTimeUnknown,
          city: chart.birthDetails.city,
          country: chart.birthDetails.country,
          latitude: chart.birthDetails.latitude,
          longitude: chart.birthDetails.longitude,
          timezone: chart.birthDetails.timezone,
          astrology_system: chart.birthDetails.system,
        })
        .select('id')
        .single();

      if (birthErr) console.warn('[Supabase] Birth details save warning:', birthErr.message);

      // 2. Insert or update astrology chart
      const { error: chartErr } = await supabaseAdmin
        .from('astrology_charts')
        .insert({
          birth_detail_id: birthRecord?.id || null,
          ascendant_sign: chart.ascendant.sign,
          ascendant_degree: chart.ascendant.degreeInSign,
          ascendant_nakshatra: chart.ascendant.nakshatra,
          sun_sign: chart.sunSign.sign,
          moon_sign: chart.moonSign.sign,
          moon_nakshatra: chart.moonSign.nakshatra,
          current_mahadasha: chart.dashas.currentMahadasha.planet,
          current_antardasha: chart.dashas.currentAntardasha.subPlanet,
          chart_payload: chart,
        });

      if (chartErr) console.warn('[Supabase] Chart save warning:', chartErr.message);
    } catch (err: any) {
      console.warn('[Supabase] Non-fatal persistence error:', err.message);
    }
  }

  // Always update memory store
  memoryStore.charts.set(userId, chart);
}

/**
 * Persist conversation message in Supabase
 */
export async function persistConversationMessage(
  conversationId: string,
  userId: string,
  message: AstrologerMessage
) {
  if (supabaseAdmin) {
    try {
      // Ensure conversation header exists
      await supabaseAdmin.from('conversations').upsert({
        id: conversationId,
        title: `Consultation with Acharya Arya`,
        updated_at: new Date().toISOString(),
      });

      // Insert message
      await supabaseAdmin.from('messages').insert({
        conversation_id: conversationId,
        sender: message.sender,
        content: message.text,
        astrological_factors: message.astrologicalFactors || [],
        reasoning: message.reasoning || [],
        suggested_questions: message.suggestedQuestions || [],
      });
    } catch (err: any) {
      console.warn('[Supabase] Message persistence warning:', err.message);
    }
  }

  const userMsgs = memoryStore.messages.get(conversationId) || [];
  userMsgs.push(message);
  memoryStore.messages.set(conversationId, userMsgs);
}

/**
 * Retrieve recent messages from Supabase or memory
 */
export async function fetchConversationHistory(conversationId: string): Promise<AstrologerMessage[]> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(20);

      if (!error && data && data.length > 0) {
        return data.map((m: any) => ({
          id: m.id,
          sender: m.sender,
          text: m.content,
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          astrologicalFactors: m.astrological_factors,
          reasoning: m.reasoning,
          suggestedQuestions: m.suggested_questions,
        }));
      }
    } catch (err: any) {
      console.warn('[Supabase] Error fetching messages:', err.message);
    }
  }

  return memoryStore.messages.get(conversationId) || [];
}

/**
 * Save Reading to Supabase or memory
 */
export async function persistSavedReading(userId: string, reading: any) {
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('saved_readings').insert({
        title: reading.title,
        category: reading.category,
        summary: reading.summary,
        full_content: reading.fullContent,
        astrological_factors: reading.astrologicalFactors || [],
      });
    } catch (err: any) {
      console.warn('[Supabase] Save reading warning:', err.message);
    }
  }

  const readings = memoryStore.savedReadings.get(userId) || [];
  readings.unshift(reading);
  memoryStore.savedReadings.set(userId, readings);
}

export async function fetchSavedReadings(userId: string) {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('saved_readings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          summary: d.summary,
          fullContent: d.full_content,
          astrologicalFactors: d.astrological_factors,
          savedAt: d.created_at,
        }));
      }
    } catch (err: any) {
      console.warn('[Supabase] Fetch saved readings warning:', err.message);
    }
  }

  return memoryStore.savedReadings.get(userId) || [];
}

export async function removeSavedReading(userId: string, readingId: string) {
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('saved_readings').delete().eq('id', readingId);
    } catch (err: any) {
      console.warn('[Supabase] Delete saved reading warning:', err.message);
    }
  }

  const current = memoryStore.savedReadings.get(userId) || [];
  memoryStore.savedReadings.set(userId, current.filter((r: any) => r.id !== readingId));
}
