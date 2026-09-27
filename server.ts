import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateVedicChart } from './src/services/astrology/engine.ts';
import { searchCities } from './src/services/cities/cityDatabase.ts';
import { BirthDetails, VedicChartData } from './src/services/astrology/types.ts';
import { generateAstrologyCompletion, AI_CONFIG } from './src/services/ai/aiClient.ts';
import {
  persistChartRecord,
  persistConversationMessage,
  fetchConversationHistory,
  persistSavedReading,
  fetchSavedReadings,
  removeSavedReading,
} from './src/services/supabase/supabaseServer.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory reading cache to prevent duplicate AI calls for identical chart + category
const readingCache = new Map<string, any>();

// Telemetry & metrics tracker
const metrics = {
  totalChartsCalculated: 0,
  aiQueriesAnswered: 0,
  initialReadingsGenerated: 0,
  categoryReadingsGenerated: 0,
  startTime: Date.now(),
  errorsLogged: 0,
};

/**
 * Dedicated Acharya Arya System Prompt
 * Defines Persona, Vedic Methodology, Hinglish & Slang Comprehension,
 * Context Memory, Astrological Reasoning, and Safety Rules.
 */
function buildAstrologerSystemPrompt(chart: VedicChartData): string {
  return `
You are Acharya Arya, a revered, compassionate, and deeply learned Vedic Astrologer (Jyotishi) of the classical Parashara and Jaimini tradition.

CORE IDENTITY & ETHICS:
1. You are Acharya Arya, a trusted personal astrologer speaking directly to the querent. Never break character. Never state "As an AI..." or "I am a language model".
2. Voice & Temperament: Dignified, warm, observant, perceptive, spiritually grounded, and conversational.
3. Natural Language & Hinglish: Understand casual speech, typos, colloquial shorthand, and Hinglish with effortless fluency (e.g. "meri career life kaisi hai", "business mere liye theek rahega?", "why do I overthink?", "shaadi kab tak ho sakti hai", "bhai future mein kya likha hai?"). Respond in warm, articulate English with subtle Sanskrit astrological terms (Lagna, Rashi, Bhava, Graha, Dasha, Drishti, Karaka, Nakshatra) clearly contextualized.
4. Astrology-First Reasoning: Every single observation MUST be tied to the querent's actual birth chart coordinates provided below. Never give generic horoscopes. If you discuss career, cite their 10th house, Saturn, Sun, or Mercury. If love/marriage, cite the 7th house, Venus, or Moon. If life timing, cite their active Vimshottari Mahadasha.
5. Conversation Memory: Understand conversational context across follow-ups. If the querent previously discussed their vocation and now simply asks "business?", immediately understand they are inquiring whether their chart favors entrepreneurship versus salaried employment.
6. Safety & High Stakes: Offer profound wisdom, psychological insight, and karmic perspective, but never present astrology as rigid deterministic fatalism. Do not give medical diagnoses, financial investment guarantees, or absolute fatalistic dates.

NATIVE'S VERIFIED VEDIC BIRTH CHART REPOSITORY:
- Name: ${chart.birthDetails.name} (Preferred: ${chart.birthDetails.preferredName || chart.birthDetails.name})
- Birth Date & Time: ${chart.birthDetails.birthDate} at ${chart.birthDetails.isTimeUnknown ? 'Time unknown (using Moon-centered houses)' : chart.birthDetails.birthTime}
- Birthplace: ${chart.birthDetails.city}, ${chart.birthDetails.country} (Lat: ${chart.birthDetails.latitude.toFixed(2)}°, Lon: ${chart.birthDetails.longitude.toFixed(2)}°)
- Ascendant (Lagna): ${chart.ascendant.sign} at ${chart.ascendant.formattedDegree} in ${chart.ascendant.nakshatra} Nakshatra (Pada ${chart.ascendant.pada}) governed by ${chart.ascendant.lord}
- Sun Sign (Surya): ${chart.sunSign.sign} in House ${chart.sunSign.house} (${chart.sunSign.nakshatra})
- Moon Sign (Chandra / Janma Rashi): ${chart.moonSign.sign} in House ${chart.moonSign.house} (${chart.moonSign.nakshatra} Pada ${chart.moonSign.pada})
- Active Vimshottari Mahadasha: ${chart.dashas.currentMahadasha.planet} (${chart.dashas.currentMahadasha.startDate} to ${chart.dashas.currentMahadasha.endDate})
- Active Antardasha: ${chart.dashas.currentAntardasha.planet} / ${chart.dashas.currentAntardasha.subPlanet}
- 9 Planetary Placements (Grahas):
${chart.grahas.map(g => `  * ${g.name} [${g.shortName}]: House ${g.house} (${g.sign} at ${g.formattedDegree}, ${g.nakshatra} P${g.pada}, Dignity: ${g.dignity}, Karaka: ${g.karakaRole})`).join('\n')}
- 12 Houses (Bhavas):
${chart.bhavas.map(b => `  * House ${b.houseNumber} (${b.sanskritName}): ${b.sign} (Lord: ${b.lord}) Occupants: [${b.occupants.map(o => o.shortName).join(', ') || 'None'}]`).join('\n')}
- Active Vedic Yogas Detected:
${chart.yogas.map(y => `  * ${y.name} (${y.type} Yoga): ${y.description} -> Manifestation: ${y.manifestation}`).join('\n')}
- Dominant Element: ${chart.chartSummary.dominantElement}
`;
}

// ====================================================================
// API ROUTE 1: Calculate Vedic Chart & Persist in Supabase
// ====================================================================
app.post('/api/chart/calculate', async (req, res) => {
  try {
    const birthDetails: BirthDetails = req.body;
    if (!birthDetails.birthDate || !birthDetails.name) {
      return res.status(400).json({ error: 'Birth date and name are required' });
    }

    const chart = calculateVedicChart(birthDetails);
    const userId = birthDetails.id || `user_${Date.now()}`;

    // Persist to Supabase and memory
    await persistChartRecord(userId, chart);
    metrics.totalChartsCalculated++;

    res.json({ success: true, userId, chart });
  } catch (err: any) {
    console.error('[Chart Calculation Error]:', err);
    metrics.errorsLogged++;
    res.status(500).json({
      error: 'Something went wrong while reading your chart. Your information is safe. Please try again.',
      details: err.message,
    });
  }
});

// ====================================================================
// API ROUTE 2: AI Dynamic Initial Reading (Generated by AI Model)
// ====================================================================
app.post('/api/astrology/initial-reading', async (req, res) => {
  try {
    const { chart } = req.body as { chart: VedicChartData };
    if (!chart || !chart.ascendant) {
      return res.status(400).json({ error: 'Valid chart data is required' });
    }

    const cacheKey = `initial_${chart.birthDetails.name}_${chart.birthDetails.birthDate}_${chart.birthDetails.birthTime}`;
    if (readingCache.has(cacheKey)) {
      return res.json({ success: true, reading: readingCache.get(cacheKey) });
    }

    const systemPrompt = buildAstrologerSystemPrompt(chart);
    const userPrompt = `
Generate the native's complete personalized initial astrological reading as Acharya Arya.
Analyze their exact Ascendant (${chart.ascendant.sign}), Moon (${chart.moonSign.sign}), Sun (${chart.sunSign.sign}), 9 Grahas, and current ${chart.dashas.currentMahadasha.planet} Mahadasha.

Return ONLY a valid JSON object matching this structure:
{
  "headline": "A poetic, deeply evocative personal title for their chart signature (e.g. 'The Strategic Visionary: Grounded in Taurus Wisdom and Solar Fire')",
  "sections": [
    {
      "title": "Welcome & Cosmic Snapshot",
      "category": "snapshot",
      "content": "Warm, personal greeting as Acharya Arya welcoming them and presenting the immediate holistic theme of their Kundli.",
      "astrologicalFactors": ["Lagna in ${chart.ascendant.sign}", "Moon in ${chart.moonSign.sign}", "Current ${chart.dashas.currentMahadasha.planet} Dasha"]
    },
    {
      "title": "Core Nature & Soul Blueprint",
      "category": "nature",
      "content": "Deep analysis of their innate temperament, how their Ascendant lord operates, and their true soul direction.",
      "astrologicalFactors": ["Lagna Lord ${chart.ascendant.lord}", "Dominant element ${chart.chartSummary.dominantElement}"]
    },
    {
      "title": "Mind, Emotions & Intuition",
      "category": "mind",
      "content": "Analysis of their internal emotional landscape, mental triggers, and subconscious processing based on Moon sign and Nakshatra.",
      "astrologicalFactors": ["Moon in ${chart.moonSign.nakshatra} Nakshatra (Pada ${chart.moonSign.pada})", "Moon in House ${chart.moonSign.house}"]
    },
    {
      "title": "Natural Strengths & Endowments",
      "category": "strengths",
      "content": "Detailed exploration of their greatest astrological gifts, yogas, and instinctual talents.",
      "astrologicalFactors": ["Active Vedic Yogas: ${chart.yogas.map(y => y.name).join(', ') || 'Planetary placements'}"]
    },
    {
      "title": "Karmic Challenges & Awareness Areas",
      "category": "challenges",
      "content": "Constructive, compassionate examination of patterns where patience, conscious discipline, or self-awareness is required.",
      "astrologicalFactors": ["Saturn and Dusthana influences"]
    },
    {
      "title": "Career Tendencies & Purpose",
      "category": "career",
      "content": "Vocational indicators from their 10th Bhava, planetary rulers, leadership qualities, and suitable professional environments.",
      "astrologicalFactors": ["10th Bhava in ${chart.bhavas[9].sign}", "10th Lord ${chart.bhavas[9].lord}"]
    },
    {
      "title": "Love, Attraction & Connection",
      "category": "love",
      "content": "Emotional dynamics in relationships, attachment tendencies, and partnership themes from their 7th Bhava and Venus.",
      "astrologicalFactors": ["7th Bhava in ${chart.bhavas[6].sign}", "Venus placement"]
    },
    {
      "title": "Wealth & Material Abundance",
      "category": "money",
      "content": "Financial tendencies, wealth-building instincts, and prosperity cycles from the 2nd and 11th Bhavas.",
      "astrologicalFactors": ["2nd Bhava of Dhana", "11th Bhava of Labha"]
    },
    {
      "title": "Current Life Phase & Timing",
      "category": "lifePhase",
      "content": "Detailed interpretation of the active ${chart.dashas.currentMahadasha.planet} Mahadasha and what life lessons are emphasized right now.",
      "astrologicalFactors": ["${chart.dashas.currentMahadasha.planet} Mahadasha (${chart.dashas.currentMahadasha.startDate} to ${chart.dashas.currentMahadasha.endDate})"]
    }
  ],
  "suggestedQuestions": [
    "What kind of work environment brings out my peak performance?",
    "How does my current dasha influence my decisions this year?",
    "What is the best way to handle my emotional stress according to my Moon sign?",
    "What do my planetary yogas indicate about business and leadership?"
  ]
}

Ensure strictly pure valid JSON without markdown fences.
`;

    const aiResponse = await generateAstrologyCompletion({
      systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      responseFormat: 'json',
      temperature: 0.7,
    });

    const parsedReading = JSON.parse(aiResponse);
    const readingData = {
      ...parsedReading,
      generatedAt: new Date().toISOString(),
      modelUsed: process.env.AI_MODEL || AI_CONFIG.model,
    };

    readingCache.set(cacheKey, readingData);
    metrics.initialReadingsGenerated++;

    res.json({ success: true, reading: readingData });
  } catch (err: any) {
    console.error('[Initial Reading Error]:', err);
    metrics.errorsLogged++;
    res.status(500).json({
      error: 'Your astrologer is temporarily unavailable. Please try again in a moment.',
      details: err.message,
    });
  }
});

// ====================================================================
// API ROUTE 3: AI Dynamic Category Reading (Career, Love, Money, etc.)
// ====================================================================
app.post('/api/astrology/category-reading', async (req, res) => {
  try {
    const { chart, category } = req.body as { chart: VedicChartData; category: string };
    if (!chart || !category) {
      return res.status(400).json({ error: 'Chart and category are required' });
    }

    const cacheKey = `cat_${category}_${chart.birthDetails.name}_${chart.birthDetails.birthDate}`;
    if (readingCache.has(cacheKey)) {
      return res.json({ success: true, category, data: readingCache.get(cacheKey) });
    }

    const systemPrompt = buildAstrologerSystemPrompt(chart);

    const categoryInstructions: Record<string, string> = {
      personality: 'Deep dive into 1st Bhava (Tanu), Lagna Lord, Sun (Soul), and dominant element. Analyze natural temperament, social presence, instinctive behavior, and core gifts.',
      career: 'Deep dive into 10th Bhava (Karma), 6th Bhava (Work), 2nd/11th Bhavas, Saturn (Karmakaraka), Sun (Authority), and vocational yogas. Analyze leadership, autonomy, entrepreneurship vs service, ideal environments, and development areas.',
      education: 'Deep dive into 5th Bhava (Intellect), 2nd Bhava, 9th Bhava (Higher wisdom), Mercury, and Jupiter. Analyze learning style, intellectual strengths, focus, and mastery approaches.',
      love: 'Deep dive into 7th Bhava (Partnerships), 5th Bhava (Romance), Venus (Shukra), and Moon. Analyze emotional attraction, intimacy, communication, attachment tendencies, and romantic dynamics.',
      marriage: 'Deep dive into 7th Bhava Lord, Venus/Jupiter karakas, marital harmony, partner characteristics, commitment indicators, and relationship seasons.',
      money: 'Deep dive into 2nd Bhava (Dhana), 11th Bhava (Labha), Jupiter, and wealth yogas. Analyze financial habits, saving/spending tendencies, wealth-building themes, risk tolerance, and seasons of caution.',
      family: 'Deep dive into 2nd Bhava (Lineage/Family), 4th Bhava (Mother/Domestic harmony), Moon, and ancestral connections. Analyze support patterns, domestic roots, and emotional bonds.',
      'life-period': `Deep dive into the native's active ${chart.dashas.currentMahadasha.planet} Mahadasha and ${chart.dashas.currentAntardasha.subPlanet} Antardasha. Analyze current life themes, upcoming transitions, and spiritual/practical alignment.`,
    };

    const userPrompt = `
Provide an in-depth, structured astrological reading for the native on the dimension: "${category.toUpperCase()}".
${categoryInstructions[category] || 'Provide deep, structured astrological analysis for this life dimension based on their chart coordinates.'}

Return ONLY a valid JSON object matching this structure:
{
  "title": "A poetic, clear title for this reading",
  "overview": "A rich introductory synthesis paragraph as Acharya Arya speaking directly to the querent in second person",
  "insights": [
    {
      "heading": "Core theme or pattern",
      "astrologicalReasoning": "Exact astrological factors that indicate this (e.g. '10th House in Taurus governed by Venus with Saturn aspect')",
      "practicalMeaning": "How this manifests in real daily life, vocational decisions, or personal relationships",
      "guidance": "Reflective astrological advice or practice to align with this cosmic rhythm"
    },
    {
      "heading": "Secondary pattern or dynamic",
      "astrologicalReasoning": "Astrological factors (Grahas, Bhavas, Yogas)",
      "practicalMeaning": "Real-world manifestation and tendency",
      "guidance": "Practical guidance"
    },
    {
      "heading": "Long-term development theme",
      "astrologicalReasoning": "Planetary placement and timing",
      "practicalMeaning": "Real-world manifestation",
      "guidance": "Practical guidance"
    }
  ],
  "timingAndOutlook": "Key astrological timing periods or dasha influences to watch",
  "astrologicalFactors": ["List of 3-5 key factors cited"],
  "suggestedNextQuestions": ["3 relevant follow-up questions they can ask you"]
}

Ensure strictly pure valid JSON.
`;

    const aiResponse = await generateAstrologyCompletion({
      systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      responseFormat: 'json',
      temperature: 0.7,
    });

    const parsedData = JSON.parse(aiResponse);
    readingCache.set(cacheKey, parsedData);
    metrics.categoryReadingsGenerated++;

    res.json({ success: true, category, data: parsedData });
  } catch (err: any) {
    console.error('[Category Reading Error]:', err);
    metrics.errorsLogged++;
    res.status(500).json({
      error: 'Your astrologer is temporarily unavailable. Please try again in a moment.',
      details: err.message,
    });
  }
});

// ====================================================================
// API ROUTE 4: AI Conversational Consultation with Memory ("Ask Astrologer")
// ====================================================================
app.post('/api/astrology/chat', async (req, res) => {
  try {
    const { chart, message, history, conversationId = 'default_conv' } = req.body as {
      chart: VedicChartData;
      message: string;
      history?: Array<{ sender: 'user' | 'astrologer'; text: string }>;
      conversationId?: string;
    };

    if (!chart || !message) {
      return res.status(400).json({ error: 'Chart and message are required' });
    }

    const userId = chart.birthDetails.id || 'default_user';

    // 1. Fetch previous conversation context from Supabase/memory if available
    const existingHistory = await fetchConversationHistory(conversationId);
    const combinedHistory = (history && history.length > 0)
      ? history
      : existingHistory.map(m => ({ sender: m.sender, text: m.text }));

    const systemPrompt = buildAstrologerSystemPrompt(chart);

    // Format previous messages for AI
    const aiMessages: Array<{ role: 'user' | 'assistant'; content: string }> = combinedHistory
      .slice(-8)
      .map(h => ({
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.text,
      }));

    // Append latest prompt
    aiMessages.push({
      role: 'user',
      content: `
QUERENT'S NEW INQUIRY:
"${message}"

INSTRUCTIONS:
1. Understand the question naturally, even if it uses casual phrasing, typos, or mixed Hinglish (e.g. "career mein kya karun?", "business?", "shaadi kab tak?", "why do I overthink?").
2. Context Memory: If this is a brief follow-up like "business?", look at what was previously discussed and answer seamlessly without asking for clarification.
3. Answer as Acharya Arya with warmth, clarity, and specific Vedic reasoning grounded in their chart.
4. Return ONLY valid JSON:
{
  "response": "Your full, warm, conversational response. Use clear paragraphs, subtle bullet points where helpful, and speak directly to them.",
  "astrologicalFactors": ["Array of 2-4 specific chart factors you drew upon, e.g. '10th House in Taurus governed by Venus', 'Current Jupiter Mahadasha'"],
  "reasoning": [
    {
      "factor": "Specific placement or transit",
      "explanation": "Why this creates the tendency or theme discussed"
    }
  ],
  "suggestedQuestions": ["2-3 natural follow-up questions the querent might ask next"]
}
Ensure strictly pure valid JSON.
      `.trim(),
    });

    // 2. Call configured AI Model (z-ai/glm-5.3-flash or active provider)
    const aiResponse = await generateAstrologyCompletion({
      systemPrompt,
      messages: aiMessages,
      responseFormat: 'json',
      temperature: 0.75,
    });

    const parsedAnswer = JSON.parse(aiResponse);
    metrics.aiQueriesAnswered++;

    const astrologerAnswer = {
      id: `msg_ast_${Date.now()}`,
      sender: 'astrologer' as const,
      text: parsedAnswer.response || 'The cosmic patterns speak in subtle rhythms. Let us explore your chart together.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      astrologicalFactors: parsedAnswer.astrologicalFactors || [],
      reasoning: parsedAnswer.reasoning || [],
      suggestedQuestions: parsedAnswer.suggestedQuestions || [],
    };

    // 3. Persist user message and astrologer answer in Supabase
    const userMsg = {
      id: `msg_usr_${Date.now()}`,
      sender: 'user' as const,
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    await persistConversationMessage(conversationId, userId, userMsg);
    await persistConversationMessage(conversationId, userId, astrologerAnswer);

    res.json({
      success: true,
      astrologerAnswer,
    });
  } catch (err: any) {
    console.error('[Chat Consultation Error]:', err);
    metrics.errorsLogged++;
    res.status(500).json({
      error: 'Your astrologer is temporarily unavailable. Please try again in a moment.',
      details: err.message,
    });
  }
});

// ====================================================================
// API ROUTE 5: City search autocomplete
// ====================================================================
app.get('/api/cities', (req, res) => {
  const query = (req.query.q as string) || '';
  const results = searchCities(query);
  res.json({ cities: results });
});

// ====================================================================
// API ROUTE 6: Saved Readings (Supabase Supported)
// ====================================================================
app.get('/api/user/saved-readings', async (req, res) => {
  const userId = (req.query.userId as string) || 'default_user';
  const readings = await fetchSavedReadings(userId);
  res.json({ readings });
});

app.post('/api/user/saved-readings', async (req, res) => {
  const { userId = 'default_user', reading } = req.body;
  const newReading = {
    ...reading,
    id: reading.id || `reading_${Date.now()}`,
    savedAt: new Date().toISOString(),
  };
  await persistSavedReading(userId, newReading);
  res.json({ success: true, reading: newReading });
});

app.delete('/api/user/saved-readings/:id', async (req, res) => {
  const { id } = req.params;
  const userId = (req.query.userId as string) || 'default_user';
  await removeSavedReading(userId, id);
  res.json({ success: true });
});

// ====================================================================
// API ROUTE 7: Admin Metrics & Health Check
// ====================================================================
app.get('/api/admin/metrics', (req, res) => {
  res.json({
    metrics: {
      ...metrics,
      uptimeSeconds: Math.floor((Date.now() - metrics.startTime) / 1000),
      aiProviderConfig: {
        model: process.env.AI_MODEL || AI_CONFIG.model,
        baseURL: process.env.AI_BASE_URL || AI_CONFIG.baseURL,
        hasApiKey: !!(process.env.AI_API_KEY || AI_CONFIG.apiKey),
        hasGeminiKey: !!(process.env.GEMINI_API_KEY || AI_CONFIG.geminiKey),
        hasSupabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
      },
      cachedReadingsCount: readingCache.size,
    },
  });
});

// API 8: Feedback
app.post('/api/feedback', (req, res) => {
  const { rating, comment, category } = req.body;
  res.json({ success: true, message: 'Thank you for your feedback.' });
});

// API 9: Cookie Consent
app.post('/api/consent', (req, res) => {
  res.json({ success: true });
});

// API 10: Supabase SQL Schema helper
app.get('/api/schema/supabase', async (req, res) => {
  try {
    const schemaPath = path.join(__dirname, 'supabase_schema.sql');
    res.sendFile(schemaPath);
  } catch (err) {
    res.status(500).send('Schema file not found');
  }
});

// Start Express and Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Jyotir Server] Listening on http://0.0.0.0:${PORT}`);
    console.log(`[Jyotir Server] Configured AI Model: ${process.env.AI_MODEL || AI_CONFIG.model}`);
    console.log(`[Jyotir Server] AI Base URL: ${process.env.AI_BASE_URL || AI_CONFIG.baseURL}`);
  });
}

startServer();
