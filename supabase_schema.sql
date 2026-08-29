-- ==============================================================================
-- DRIP E-Commerce Application — Supabase Database Schema & RLS Setup
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Carts Table
-- Used by src/store/cart.ts to sync user carts to Supabase
CREATE TABLE IF NOT EXISTS public.carts (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on Carts
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own cart" 
    ON public.carts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart" 
    ON public.carts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart" 
    ON public.carts FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart" 
    ON public.carts FOR DELETE 
    USING (auth.uid() = user_id);

-- 3. Style DNA Table
-- Used by src/store/styleDNA.ts to persist biological silhouette & palette blueprints
CREATE TABLE IF NOT EXISTS public.style_dna (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    body_shape TEXT,
    height_cm NUMERIC,
    fit_preference TEXT DEFAULT 'Regular Fit',
    skin_tone TEXT,
    color_palette TEXT[],
    avoid_colors TEXT[],
    style_vibe TEXT,
    occasions TEXT[],
    budget_range TEXT,
    liked_products TEXT[],
    disliked_products TEXT[],
    completed_onboarding BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on Style DNA
ALTER TABLE public.style_dna ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own style_dna" 
    ON public.style_dna FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own style_dna" 
    ON public.style_dna FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own style_dna" 
    ON public.style_dna FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own style_dna" 
    ON public.style_dna FOR DELETE 
    USING (auth.uid() = user_id);

-- 4. Automatic Updated At Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_carts_updated
    BEFORE UPDATE ON public.carts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_style_dna_updated
    BEFORE UPDATE ON public.style_dna
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
