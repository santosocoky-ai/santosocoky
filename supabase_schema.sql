-- VALID SQL SCRIPT FOR SUPABASE SQL EDITOR
-- Copy and paste this into your SQL Editor at https://app.supabase.com

-- 1. Create Tables
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    contact_email TEXT,
    twitter_url TEXT,
    github_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    repo_url TEXT,
    live_url TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users NOT NULL
);

CREATE TABLE public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    cover_image TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author_id UUID REFERENCES auth.users NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Profiles: Anyone can read, only user can update
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Projects: Anyone can read, only user can manage
CREATE POLICY "Projects are viewable by everyone." ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own projects." ON public.projects
    FOR ALL USING (auth.uid() = user_id);

-- Posts: Anyone can read published posts, only user can manage all
CREATE POLICY "Published posts are viewable by everyone." ON public.posts
    FOR SELECT USING (published = true OR auth.uid() = author_id);

CREATE POLICY "Users can manage their own posts." ON public.posts
    FOR ALL USING (auth.uid() = author_id);

-- 4. Trigger for public profiles (Optional: creates a profile when someone signs up)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
