-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE tag_type AS ENUM ('collection', 'meal_type', 'diet');
CREATE TYPE recipe_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE recipe_status AS ENUM ('draft', 'pending', 'published', 'rejected');
CREATE TYPE ingredient_category AS ENUM ('produce', 'meat', 'dairy', 'pantry', 'other');

-- 2. TABLES

-- PROFILES: Linked to Supabase Auth
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TAGS: Categorization system
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    type tag_type NOT NULL,
    icon TEXT, -- Lucide icon name
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INGREDIENT_MASTER: Standardized ingredients
CREATE TABLE ingredient_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category ingredient_category DEFAULT 'other',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RECIPES: Core entity
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    prep_time INT, -- in minutes
    cook_time INT, -- in minutes
    difficulty recipe_difficulty DEFAULT 'easy',
    base_servings INT DEFAULT 2,
    status recipe_status DEFAULT 'pending',
    avg_rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RECIPE_TAGS (Junction table)
CREATE TABLE recipe_tags (
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, tag_id)
);

-- RECIPE_INGREDIENTS
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredient_master(id) ON DELETE RESTRICT,
    quantity NUMERIC NOT NULL,
    unit TEXT,
    prep_note TEXT
);

-- RECIPE_STEPS
CREATE TABLE recipe_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    content TEXT NOT NULL,
    timer_seconds INT
);

-- BOOKMARKS
CREATE TABLE bookmarks (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, recipe_id)
);

-- REVIEWS
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SHOPPING_LIST
CREATE TABLE shopping_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredient_master(id),
    target_quantity NUMERIC,
    unit TEXT,
    is_checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FUNCTIONS & TRIGGERS

-- Automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username', -- Assumes metadata is passed during signup
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES (Basic examples)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Recipes are viewable if published" ON recipes FOR SELECT USING (status = 'published');
CREATE POLICY "Author can see their own recipes" ON recipes FOR SELECT USING (auth.uid() = author_id);
