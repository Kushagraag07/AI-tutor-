/*
  # AI Tutor Platform Schema

  1. New Tables
    - users (managed by Supabase Auth)
    - courses
      - Basic course information
    - modules
      - Course content organized into modules
      - Includes difficulty level
    - enrollments
      - Tracks student course enrollments
    - assessments
      - Stores pre/post assessment questions
    - student_progress
      - Tracks student progress through modules
      - Stores assessment scores
    - student_responses
      - Stores detailed assessment responses

  2. Security
    - Enable RLS on all tables
    - Policies for student and admin access
*/

-- Courses table
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Modules table
CREATE TABLE modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id),
  title text NOT NULL,
  content text NOT NULL,
  difficulty_level int NOT NULL DEFAULT 1,
  sequence_order int NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enrollments table
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  course_id uuid REFERENCES courses(id),
  status text NOT NULL DEFAULT 'active',
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, course_id)
);

-- Assessments table
CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id),
  type text NOT NULL, -- 'pre' or 'post'
  question text NOT NULL,
  correct_answer text NOT NULL,
  difficulty_level int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Student Progress table
CREATE TABLE student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  module_id uuid REFERENCES modules(id),
  completed boolean DEFAULT false,
  score int,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Student Responses table
CREATE TABLE student_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  assessment_id uuid REFERENCES assessments(id),
  response text NOT NULL,
  is_correct boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_responses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public courses are viewable by everyone"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Students can view enrolled course modules"
  ON modules FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM enrollments
    WHERE enrollments.course_id = modules.course_id
    AND enrollments.user_id = auth.uid()
  ));

CREATE POLICY "Students can view their enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can create enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can view assessments for enrolled courses"
  ON assessments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM enrollments
    WHERE enrollments.course_id = assessments.course_id
    AND enrollments.user_id = auth.uid()
  ));

CREATE POLICY "Students can view their progress"
  ON student_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update their progress"
  ON student_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can view their responses"
  ON student_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can submit responses"
  ON student_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);