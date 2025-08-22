-- Security policies for the profiles table

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own profile
CREATE POLICY "Allow users to view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy for users to create their own profile
CREATE POLICY "Allow users to create their profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Allow users to update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy for public to view all profiles
CREATE POLICY "Allow anyone to view profiles" ON profiles
  FOR SELECT USING (true);
