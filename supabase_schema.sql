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


-- 5. Products Table
-- Used for database-backed product catalog (Phase 4)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price TEXT NOT NULL,
    original_price TEXT,
    price_number NUMERIC NOT NULL,
    original_price_number NUMERIC,
    rating NUMERIC DEFAULT 4.5,
    reviews TEXT DEFAULT '0',
    image TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    sizes JSONB DEFAULT '[]'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    fit TEXT,
    material TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    body_shape_suitable JSONB DEFAULT '[]'::jsonb,
    skin_tone_suitable JSONB DEFAULT '[]'::jsonb,
    stock INTEGER DEFAULT 50,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products
CREATE POLICY "Public read products" 
    ON public.products FOR SELECT 
    USING (true);

-- Allow admins or service role to insert/update/delete products
CREATE POLICY "Admin manage products" 
    ON public.products FOR ALL 
    USING (auth.jwt() ->> 'email' = 'admin@drip.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'admin@drip.com');

CREATE TRIGGER on_products_updated
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
