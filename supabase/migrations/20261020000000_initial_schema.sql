-- Custom Types
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'plot', 'commercial');
CREATE TYPE property_purpose AS ENUM ('sale', 'rent');
CREATE TYPE property_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'published', 'archived');
CREATE TYPE seller_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE inquiry_status AS ENUM ('unread', 'read', 'replied', 'closed');

-- Profiles (Extends Supabase Auth)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role user_role DEFAULT 'buyer' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seller Profiles
CREATE TABLE seller_profiles (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    company_name TEXT,
    gst_number TEXT,
    verification_status seller_status DEFAULT 'pending',
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties
CREATE TABLE properties (
    -- Changed from uuid_generate_v4() to gen_random_uuid()
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    property_type property_type NOT NULL,
    purpose property_purpose NOT NULL,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    city TEXT NOT NULL,
    locality TEXT NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    built_up_area NUMERIC,
    status property_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone."
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile."
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- Seller Profiles Policies
CREATE POLICY "Seller profiles viewable by everyone."
    ON seller_profiles FOR SELECT USING (true);

-- Properties Policies
CREATE POLICY "Published properties are viewable by everyone."
    ON properties FOR SELECT USING (status = 'published');

CREATE POLICY "Sellers can view all their own properties."
    ON properties FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can insert their own properties."
    ON properties FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own properties."
    ON properties FOR UPDATE USING (auth.uid() = seller_id);

-- Admin Override (Applies to all tables)
CREATE POLICY "Admins have full access to properties"
    ON properties FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );