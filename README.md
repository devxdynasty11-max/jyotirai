# Jyotir — AI Vedic Astrology & Digital Astrologer Platform

Jyotir is a production-grade digital astrology platform where personalized astrological insights and conversational consultations are generated dynamically by an AI model (configured by default for **NVIDIA NIM API** with `z-ai/glm-5.3-flash`), grounded strictly in deterministic Vedic Sidereal Lahiri astronomical calculations and persisted in **Supabase**.

---

## 1. Environment Configuration

To configure your API credentials, set the following environment variables in your environment (or copy `.env.example` to `.env`):

```bash
# ==================================================
# AI MODEL CONFIGURATION (NVIDIA NIM / OPENAI-COMPATIBLE)
# ==================================================
# Your NVIDIA NIM API key or OpenAI-compatible API key
AI_API_KEY="your-nvidia-nim-or-openai-api-key"

# The API Base URL (defaults to NVIDIA NIM endpoint)
AI_BASE_URL="https://integrate.api.nvidia.com/v1"

# The AI Model (configurable, defaults to z-ai/glm-5.3-flash)
AI_MODEL="z-ai/glm-5.3-flash"

# Optional fallback if using Google Gemini
GEMINI_API_KEY=""

# ==================================================
# SUPABASE DATABASE & AUTHENTICATION
# ==================================================
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Where to set these in Google AI Studio:
1. Open the **Secrets / Environment** panel in the AI Studio sidebar.
2. Add `AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL`.
3. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
4. The server automatically detects these variables dynamically without requiring any code modifications.

---

## 2. Architecture & Data Pipeline

```
User Birth Data
     ↓
Deterministic Astrology Calculation Engine (Sidereal Lahiri Ayanamsha)
     ↓
Structured Vedic Chart Payload
(Ascendant, 9 Grahas, 12 Bhavas, 27 Nakshatras & Padas, 120-Year Vimshottari Dashas, Yogas)
     ↓
Server-Side AI API (/api/astrology/*)
Using configured AI_MODEL (e.g. z-ai/glm-5.3-flash)
     ↓
Dynamic Personalized Interpretation (Acharya Arya Persona)
     ↓
Supabase Database Persistence (Profiles, Charts, Conversations, Messages, Saved Readings)
     ↓
Interactive Frontend Interface
```

### Key Rules Implemented:
1. **Zero Hallucinated Chart Coordinates**: Planetary longitudes, Ascendant degrees, house cusps, and Vimshottari Dasha dates are computed mathematically by the deterministic calculation engine before being passed to the AI.
2. **Zero Hardcoded Astrology Answers**: All readings (initial reading, personality, nature, career, education, wealth, love, marriage, family, dashas, follow-ups, and custom questions) are dynamically synthesized by the configured AI model using the querent's actual chart data.
3. **Conversational Memory**: The digital astrologer retains past message context in Supabase and provides contextual answers to shorthand follow-ups (e.g., asking *"business?"* after discussing career).
4. **Hinglish & Casual Language Support**: Smoothly interprets casual slang, typos, and mixed Hindi/English queries.

---

## 3. Database Schema

The complete PostgreSQL database schema with Row Level Security (RLS) is located in `supabase_schema.sql` and includes:
- `profiles`
- `birth_details`
- `astrology_charts`
- `chart_factors`
- `conversations`
- `messages`
- `saved_readings`
- `user_preferences`
- `consent_records`
- `usage`
- `feedback`

---

## 4. Verification & Testing

- Run development server: `npm run dev` (`tsx server.ts`)
- Run compilation check: `npm run build`
- Run linting: `npm run lint`
