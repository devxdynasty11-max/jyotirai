-- ====================================================================
-- Supabase Schema for Jyotir: Personalized Vedic Astrology Platform
-- Production PostgreSQL Database Migration with Row Level Security (RLS)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BIRTH DETAILS TABLE
CREATE TABLE IF NOT EXISTS public.birth_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    preferred_name TEXT,
    birth_date DATE NOT NULL,
    birth_time TIME WITHOUT TIME ZONE,
    is_time_unknown BOOLEAN DEFAULT FALSE,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    timezone NUMERIC(4, 2) NOT NULL,
    astrology_system TEXT DEFAULT 'Vedic (Sidereal Lahiri)' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ASTROLOGY CHARTS TABLE
CREATE TABLE IF NOT EXISTS public.astrology_charts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    birth_detail_id UUID REFERENCES public.birth_details(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    ascendant_sign TEXT NOT NULL,
    ascendant_degree NUMERIC(6, 2) NOT NULL,
    ascendant_nakshatra TEXT NOT NULL,
    sun_sign TEXT NOT NULL,
    moon_sign TEXT NOT NULL,
    moon_nakshatra TEXT NOT NULL,
    current_mahadasha TEXT NOT NULL,
    current_antardasha TEXT,
    chart_payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CHART FACTORS TABLE
CREATE TABLE IF NOT EXISTS public.chart_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chart_id UUID REFERENCES public.astrology_charts(id) ON DELETE CASCADE,
    factor_type TEXT NOT NULL, -- 'graha', 'bhava', 'yoga', 'dasha'
    name TEXT NOT NULL,
    placement_description TEXT NOT NULL,
    dignity TEXT,
    is_auspicious BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    chart_id UUID REFERENCES public.astrology_charts(id) ON DELETE SET NULL,
    title TEXT DEFAULT 'Consultation with Acharya Arya' NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender TEXT CHECK (sender IN ('user', 'astrologer')) NOT NULL,
    content TEXT NOT NULL,
    astrological_factors JSONB,
    reasoning JSONB,
    suggested_questions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SAVED READINGS TABLE
CREATE TABLE IF NOT EXISTS public.saved_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'initial', 'career', 'love', 'money', 'family', 'life_period'
    summary TEXT NOT NULL,
    full_content TEXT NOT NULL,
    astrological_factors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    chart_style TEXT DEFAULT 'north_indian' CHECK (chart_style IN ('north_indian', 'south_indian')),
    reading_mode TEXT DEFAULT 'beginner' CHECK (reading_mode IN ('beginner', 'advanced')),
    enable_sound BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CONSENT RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    anonymous_id TEXT,
    ip_hash TEXT,
    necessary BOOLEAN DEFAULT TRUE NOT NULL,
    preferences BOOLEAN DEFAULT FALSE NOT NULL,
    analytics BOOLEAN DEFAULT FALSE NOT NULL,
    marketing BOOLEAN DEFAULT FALSE NOT NULL,
    consented_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. USAGE & ANALYTICS METRICS TABLE
CREATE TABLE IF NOT EXISTS public.usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL, -- 'onboarding_complete', 'chart_generated', 'question_asked', etc.
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birth_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astrology_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and edit their own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

CREATE POLICY "Users can manage their own birth details"
    ON public.birth_details FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own astrology charts"
    ON public.astrology_charts FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their conversations"
    ON public.conversations FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage messages in their conversations"
    ON public.messages FOR ALL
    USING (
        conversation_id IN (
            SELECT id FROM public.conversations WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their saved readings"
    ON public.saved_readings FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage preferences"
    ON public.user_preferences FOR ALL
    USING (auth.uid() = user_id);
