-- Create users table with role field
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_content table for home, about, apps, contact sections
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  content JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create apps table (dynamic apps management)
CREATE TABLE IF NOT EXISTS apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  download_link TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[],
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table for contact form submissions
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  replied_at TIMESTAMPTZ,
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for site_content (public read, authenticated write)
CREATE POLICY "Anyone can view site content" ON site_content
  FOR SELECT USING (true);

CREATE POLICY "Any authenticated user can modify site content" ON site_content
  FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for apps (public read, authenticated write)
CREATE POLICY "Anyone can view apps" ON apps
  FOR SELECT USING (true);

CREATE POLICY "Any authenticated user can modify apps" ON apps
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Authenticated users can view messages
CREATE POLICY "Any authenticated user can view messages" ON messages
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Any authenticated user can update messages" ON messages
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON apps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user record when someone signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user record on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert initial data
INSERT INTO site_content (section_name, title, subtitle, content, metadata) VALUES
('home_hero', 'Blessings Chilemba', 'Developer & App Creator', 
 '{"description": "Crafting digital experiences that make a difference. Building innovative apps and solutions that empower users."}',
 '{"buttons": [{"text": "Learn More", "href": "#about"}, {"text": "View My Apps", "href": "#apps"}]}'),

('about', 'About Me', 'Get to know me better',
 '{"description": "Passionate about creating digital solutions that solve real-world problems. I specialize in developing innovative applications that combine elegant design with robust functionality. With a keen eye for detail and a love for clean code, I bring ideas to life through technology.\n\nWhether it''s a mobile app, a web application, or a creative tool, I strive to deliver exceptional user experiences that make a meaningful impact."}',
 '{"skills": [{"icon": "Code", "title": "Web Development", "description": "Building responsive and performant web applications with modern frameworks."}, {"icon": "Smartphone", "title": "Mobile Development", "description": "Creating native and cross-platform mobile apps with excellent UX."}, {"icon": "Palette", "title": "UI/UX Design", "description": "Designing beautiful and intuitive user interfaces that users love."}, {"icon": "Rocket", "title": "Innovation", "description": "Always exploring new technologies and pushing the boundaries of what''s possible."}]}'),

('contact', 'Contact', 'Get in touch with me',
 '{"description": "Get in touch with me for collaboration, questions, or just to say hello! Feel free to reach out through any of these channels. I''m always open to discussing new opportunities.", "email": "contact@blessings.com", "social": [{"name": "Github", "url": "https://github.com"}, {"name": "Linkedin", "url": "https://linkedin.com"}, {"name": "Twitter", "url": "https://twitter.com"}]}',
 NULL);

-- Enable insert for public on auth trigger function
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.users TO anon, authenticated;

-- Insert sample apps data
INSERT INTO apps (title, description, category, download_link, tags, display_order) VALUES
('Productivity Pro', 'A powerful task management app that helps you stay organized and boost your productivity. Features include smart reminders, project tracking, and team collaboration.', 'Productivity', 'https://example.com/download/productivity-pro', ARRAY['iOS', 'Android', 'Task Management'], 1),
('Photo Editor Plus', 'Professional-grade photo editing tools in your pocket. Transform your photos with filters, effects, and advanced editing features.', 'Photo & Video', 'https://example.com/download/photo-editor', ARRAY['iOS', 'Android', 'Photo Editing'], 2),
('Finance Tracker', 'Take control of your finances with an intuitive expense tracker. Monitor your spending, set budgets, and achieve your financial goals.', 'Finance', 'https://example.com/download/finance-tracker', ARRAY['iOS', 'Finance', 'Analytics'], 3),
('Mindful Meditation', 'Find peace and clarity with guided meditation sessions. Features relaxing sounds, breathing exercises, and personalized mindfulness programs.', 'Health & Wellness', 'https://example.com/download/mindful-meditation', ARRAY['iOS', 'Android', 'Wellness'], 4),
('Language Learner', 'Master new languages with interactive lessons, speech recognition, and spaced repetition. Learn at your own pace with personalized courses.', 'Education', 'https://example.com/download/language-learner', ARRAY['iOS', 'Android', 'Education'], 5),
('Weather Forecast', 'Get accurate weather forecasts with beautiful visuals. Track multiple locations, receive alerts, and plan your activities with confidence.', 'Weather', 'https://example.com/download/weather-forecast', ARRAY['iOS', 'Weather', 'Forecasts'], 6);

