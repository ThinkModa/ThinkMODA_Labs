-- Create custom types
CREATE TYPE user_role AS ENUM ('ADMIN', 'BASIC');
CREATE TYPE course_visibility AS ENUM ('OPEN', 'PRIVATE');

-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role user_role DEFAULT 'BASIC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  visibility course_visibility DEFAULT 'OPEN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sections table
CREATE TABLE sections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE lessons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  details TEXT,
  section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_courses junction table
CREATE TABLE user_courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create user_progress table
CREATE TABLE user_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Create indexes for better performance
CREATE INDEX idx_sections_course_id ON sections(course_id);
CREATE INDEX idx_lessons_section_id ON lessons(section_id);
CREATE INDEX idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX idx_user_courses_course_id ON user_courses(course_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Anyone can read open courses
CREATE POLICY "Anyone can view open courses" ON courses
  FOR SELECT USING (visibility = 'OPEN');

-- Admins can manage all courses
CREATE POLICY "Admins can manage all courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN'
    )
  );

-- Users can view sections of courses they have access to
CREATE POLICY "Users can view sections of accessible courses" ON sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = sections.course_id 
      AND (courses.visibility = 'OPEN' OR 
           EXISTS (
             SELECT 1 FROM user_courses 
             WHERE user_courses.course_id = courses.id 
             AND user_courses.user_id = auth.uid()::text
           )
      )
    )
  );

-- Admins can manage all sections
CREATE POLICY "Admins can manage all sections" ON sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN'
    )
  );

-- Users can view lessons of sections they have access to
CREATE POLICY "Users can view lessons of accessible sections" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sections s
      JOIN courses c ON s.course_id = c.id
      WHERE s.id = lessons.section_id 
      AND (c.visibility = 'OPEN' OR 
           EXISTS (
             SELECT 1 FROM user_courses 
             WHERE user_courses.course_id = c.id 
             AND user_courses.user_id = auth.uid()::text
           )
      )
    )
  );

-- Admins can manage all lessons
CREATE POLICY "Admins can manage all lessons" ON lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN'
    )
  );

-- Users can manage their own progress
CREATE POLICY "Users can manage own progress" ON user_progress
  FOR ALL USING (user_id = auth.uid()::text);

-- Admins can view all progress
CREATE POLICY "Admins can view all progress" ON user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN'
    )
  );

-- Users can view their own course assignments
CREATE POLICY "Users can view own course assignments" ON user_courses
  FOR SELECT USING (user_id = auth.uid()::text);

-- Admins can manage all course assignments
CREATE POLICY "Admins can manage all course assignments" ON user_courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN'
    )
  ); 