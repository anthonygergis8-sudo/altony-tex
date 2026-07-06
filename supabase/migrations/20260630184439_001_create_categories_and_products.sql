/*
# Create Categories and Products Tables for Textile E-commerce Platform

1. New Tables
- `categories`
  - `id` (serial, primary key)
  - `type` (text, not null) - 'yarn' or 'fabric'
  - `slug` (text, unique, not null) - e.g., 'cotton', 'polyester'
  - `name` (jsonb, not null) - localized names {"ar": "...", "en": "...", "zh": "..."}
  - `image` (text) - image URL
  - `gradient` (text) - Tailwind gradient classes
  - `created_at` (timestamptz)

- `products`
  - `id` (serial, primary key)
  - `category_id` (integer, foreign key to categories)
  - `type` (text, not null) - 'yarn' or 'fabric'
  - `slug` (text, unique, not null)
  - `name` (jsonb, not null) - localized names
  - `description` (jsonb) - localized descriptions
  - `image` (text) - image URL
  - `composition` (jsonb) - localized composition for fabrics
  - `width` (text) - fabric width
  - `weight` (text) - fabric weight
  - `available_counts` (text[]) - array of yarn counts
  - `collection` (text) - 'summer' or 'winter' for fabrics
  - `created_at` (timestamptz)

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated read access (public catalog).
- Allow authenticated write access for admin operations.

3. Seed Data
- Insert 6 yarn categories: cotton, polyester, mixed, viscose, flat, lycra
- Insert 6 fabric products (3 summer, 3 winter)
- Insert 6 yarn products
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('yarn', 'fabric')),
  slug text UNIQUE NOT NULL,
  name jsonb NOT NULL,
  image text,
  gradient text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  category_id integer REFERENCES categories(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('yarn', 'fabric')),
  slug text UNIQUE NOT NULL,
  name jsonb NOT NULL,
  description jsonb,
  image text,
  composition jsonb,
  width text,
  weight text,
  available_counts text[],
  collection text CHECK (collection IN ('summer', 'winter')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Categories policies (anon can read, authenticated can write)
DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_write_categories" ON categories;
CREATE POLICY "auth_write_categories" ON categories FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Products policies (anon can read, authenticated can write)
DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_write_products" ON products;
CREATE POLICY "auth_write_products" ON products FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Seed yarn categories
INSERT INTO categories (type, slug, name, image, gradient) VALUES
('yarn', 'cotton', '{"ar": "قطن", "en": "Cotton", "zh": "棉纱"}', 'https://images.pexels.com/photos/616903/pexels-photo-616903.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-800/30'),
('yarn', 'polyester', '{"ar": "بوليستر", "en": "Polyester", "zh": "涤纶纱"}', 'https://images.pexels.com/photos/3825585/pexels-photo-3825585.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-blue-100 to-cyan-200 dark:from-blue-900/30 dark:to-cyan-800/30'),
('yarn', 'mixed', '{"ar": "مخلوط", "en": "Mixed", "zh": "混纺纱"}', 'https://images.pexels.com/photos/3715889/pexels-photo-3715889.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-violet-100 to-purple-200 dark:from-violet-900/30 dark:to-purple-800/30'),
('yarn', 'viscose', '{"ar": "فيكوس", "en": "Viscose", "zh": "粘胶纱"}', 'https://images.pexels.com/photos/5485705/pexels-photo-5485705.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-emerald-100 to-teal-200 dark:from-emerald-900/30 dark:to-teal-800/30'),
('yarn', 'flat', '{"ar": "فلات", "en": "Flat", "zh": "扁纱"}', 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-rose-100 to-pink-200 dark:from-rose-900/30 dark:to-pink-800/30'),
('yarn', 'lycra', '{"ar": "ليكرا", "en": "Lycra", "zh": "莱卡纱"}', 'https://images.pexels.com/photos/5810887/pexels-photo-5810887.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-indigo-100 to-blue-200 dark:from-indigo-900/30 dark:to-blue-800/30')
ON CONFLICT (slug) DO NOTHING;

-- Seed yarn products
INSERT INTO products (category_id, type, slug, name, description, image, available_counts) VALUES
((SELECT id FROM categories WHERE slug = 'cotton'), 'yarn', 'cotton-premium', '{"ar": "غزل قطن ممتاز", "en": "Premium Cotton Yarn", "zh": "优质棉纱"}', '{"ar": "غزل قطن طبيعي عالي الجودة", "en": "High-quality natural cotton yarn", "zh": "优质天然棉纱"}', 'https://images.pexels.com/photos/616903/pexels-photo-616903.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['30/1', '40/1', '50/1', '60/1', '80/1']),
((SELECT id FROM categories WHERE slug = 'polyester'), 'yarn', 'polyester-standard', '{"ar": "غزل بوليستر", "en": "Polyester Yarn", "zh": "涤纶纱"}', '{"ar": "غزل بوليستر متين ومتانة عالية", "en": "Strong and durable polyester yarn", "zh": "强韧耐用的涤纶纱"}', 'https://images.pexels.com/photos/3825585/pexels-photo-3825585.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['20/1', '30/1', '40/1', '50/1', '60/1']),
((SELECT id FROM categories WHERE slug = 'mixed'), 'yarn', 'mixed-blend', '{"ar": "غزل مخلوط", "en": "Mixed Blend Yarn", "zh": "混纺纱"}', '{"ar": "مزيج من القطن والبوليستر", "en": "Blend of cotton and polyester", "zh": "棉涤混纺纱"}', 'https://images.pexels.com/photos/3715889/pexels-photo-3715889.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['24/1', '30/1', '40/1', '50/1']),
((SELECT id FROM categories WHERE slug = 'viscose'), 'yarn', 'viscose-standard', '{"ar": "غزل فيكوس", "en": "Viscose Yarn", "zh": "粘胶纱"}', '{"ar": "غزل فيكوس ناعم ولامع", "en": "Soft and lustrous viscose yarn", "zh": "柔软光泽的粘胶纱"}', 'https://images.pexels.com/photos/5485705/pexels-photo-5485705.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['30/1', '40/1', '50/1', '60/1']),
((SELECT id FROM categories WHERE slug = 'flat'), 'yarn', 'flat-standard', '{"ar": "غزل فلات", "en": "Flat Yarn", "zh": "扁纱"}', '{"ar": "غزل فلات للخياطة والحياكة", "en": "Flat yarn for sewing and knitting", "zh": "缝纫编织用扁纱"}', 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['20/1', '24/1', '30/1', '40/1']),
((SELECT id FROM categories WHERE slug = 'lycra'), 'yarn', 'lycra-standard', '{"ar": "غزل ليكرا", "en": "Lycra Yarn", "zh": "莱卡纱"}', '{"ar": "غزل ليكرا مرن للملابس الرياضية", "en": "Stretchy lycra yarn for sportswear", "zh": "运动服饰用弹性莱卡纱"}', 'https://images.pexels.com/photos/5810887/pexels-photo-5810887.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['30/1', '40/1', '50/1'])
ON CONFLICT (slug) DO NOTHING;

-- Seed fabric products (summer collection)
INSERT INTO products (type, slug, name, description, image, composition, width, weight, collection) VALUES
('fabric', 'summer-cotton', '{"ar": "قماش قطن صيفي", "en": "Summer Cotton Fabric", "zh": "夏季棉布"}', '{"ar": "قماش قطن خفيف وم breathable للصيف", "en": "Light and breathable cotton fabric for summer", "zh": "轻薄透气的夏季棉布"}', 'https://images.pexels.com/photos/731872/pexels-photo-731872.jpeg?auto=compress&cs=tinysrgb&w=400', '{"ar": "قطن 100%", "en": "100% Cotton", "zh": "100%棉"}', '150 cm', '120 g/m²', 'summer'),
('fabric', 'summer-linen', '{"ar": "قماش كتان", "en": "Linen Fabric", "zh": "亚麻布"}', '{"ar": "قماش كتان فاخر للملابس الصيفية", "en": "Premium linen fabric for summer clothing", "zh": "夏季服饰用优质亚麻布"}', 'https://images.pexels.com/photos/5082570/pexels-photo-5082570.jpeg?auto=compress&cs=tinysrgb&w=400', '{"ar": "كتان 100%", "en": "100% Linen", "zh": "100%亚麻"}', '140 cm', '150 g/m²', 'summer'),
('fabric', 'summer-silk', '{"ar": "قماش حرير", "en": "Silk Fabric", "zh": "丝绸"}', '{"ar": "حرير طبيعي فاخر", "en": "Premium natural silk fabric", "zh": "优质天然丝绸"}', 'https://images.pexels.com/photos/3628850/pexels-photo-3628850.jpeg?auto=compress&cs=tinysrgb&w=400', '{"ar": "حرير طبيعي 100%", "en": "100% Natural Silk", "zh": "100%天然丝绸"}', '114 cm', '80 g/m²', 'summer')
ON CONFLICT (slug) DO NOTHING;

-- Seed fabric products (winter collection)
INSERT INTO products (type, slug, name, description, image, composition, width, weight, collection) VALUES
('fabric', 'winter-wool', '{"ar": "قماش صوف", "en": "Wool Fabric", "zh": "羊毛布"}', '{"ar": "صوف دافئ وعالي الجودة للشتاء", "en": "Warm and high-quality wool fabric for winter", "zh": "冬季保暖优质羊毛布"}', 'https://images.pexels.com/photos/1683980/pexels-photo-1636980.jpeg?auto=compress&cs=tinysrgb&w=400', '{"ar": "صوف 100%", "en": "100% Wool", "zh": "100%羊毛"}', '150 cm', '280 g/m²', 'winter'),
('fabric', 'winter-velvet', '{"ar": "قماش مخمل", "en": "Velvet Fabric", "zh": "丝绒"}', '{"ar": "مخمل فاخر للملابس والمفروشات", "en": "Luxury velvet for apparel and upholstery", "zh": "服装和家具用奢华丝绒"}', 'https://images.pexels.com/photos/5553266/pexels-photo-5553266.jpeg?auto=compress&cs=tinysrgb&w=400', '{"ar": "قطن 85% بوليستر 15%", "en": "85% Cotton 15% Polyester", "zh": "85%棉15%涤纶"}', '140 cm', '350 g/m²', 'winter'),
('fabric', 'winter-fleece', '{"ar": "قماش فليس", "en": "Fleece Fabric", "zh": "抓绒布"}', '{"ar": "فليس ناعم ودافئ", "en": "Soft and warm fleece fabric", "zh": "柔软保暖的抓绒布"}', 'https://images.pexels.com/photos/5810887/pexels-photo-5810887.jpeg?auto=compress&cs=tinysrgb&w=400', '{"ar": "بوليستر 100%", "en": "100% Polyester", "zh": "100%涤纶"}', '160 cm', '260 g/m²', 'winter')
ON CONFLICT (slug) DO NOTHING;