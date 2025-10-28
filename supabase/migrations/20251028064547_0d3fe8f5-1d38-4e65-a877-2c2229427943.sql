-- Create profiles table for teachers/admins
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'teacher',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT,
  year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create sessions table
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_name TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  duration INTEGER NOT NULL,
  description TEXT,
  expiry_time TIMESTAMP WITH TIME ZONE,
  qr_data TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location TEXT,
  UNIQUE(session_id, student_id)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for students
CREATE POLICY "Authenticated users can view students"
  ON public.students FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create students"
  ON public.students FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Authenticated users can update students"
  ON public.students FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Authenticated users can delete students"
  ON public.students FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- RLS Policies for sessions
CREATE POLICY "Authenticated users can view sessions"
  ON public.sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create sessions"
  ON public.sessions FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Authenticated users can update their sessions"
  ON public.sessions FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Authenticated users can delete their sessions"
  ON public.sessions FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- RLS Policies for attendance
CREATE POLICY "Authenticated users can view attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can mark attendance"
  ON public.attendance FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_students_student_id ON public.students(student_id);
CREATE INDEX idx_sessions_session_id ON public.sessions(session_id);
CREATE INDEX idx_attendance_session_id ON public.attendance(session_id);
CREATE INDEX idx_attendance_student_id ON public.attendance(student_id);