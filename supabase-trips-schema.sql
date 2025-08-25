-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  cover_image_url TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  tags TEXT[],
  budget DECIMAL(10,2),
  currency TEXT DEFAULT 'USD'
);

-- Create trip_entries table
CREATE TABLE IF NOT EXISTS trip_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  location TEXT,
  entry_date DATE NOT NULL,
  image_urls TEXT[],
  mood TEXT CHECK (mood IN ('excited', 'happy', 'neutral', 'sad', 'stressed')),
  tags TEXT[]
);

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_entries ENABLE ROW LEVEL SECURITY;

-- Policies for trips table
CREATE POLICY "Users can view their own trips" ON trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public trips" ON trips
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create their own trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" ON trips
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" ON trips
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for trip_entries table
CREATE POLICY "Users can view entries from their own trips" ON trip_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_entries.trip_id 
      AND (trips.user_id = auth.uid() OR trips.is_public = true)
    )
  );

CREATE POLICY "Users can create entries in their own trips" ON trip_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_entries.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update entries in their own trips" ON trip_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_entries.trip_id 
      AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_entries.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete entries in their own trips" ON trip_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_entries.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_is_public ON trips(is_public);
CREATE INDEX IF NOT EXISTS idx_trip_entries_trip_id ON trip_entries(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_entries_user_id ON trip_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_entries_entry_date ON trip_entries(entry_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_entries_updated_at BEFORE UPDATE ON trip_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add notes column to trip_entries table
ALTER TABLE trip_entries 
ADD COLUMN notes TEXT;

-- Update existing records to set notes to content (optional migration)
UPDATE trip_entries 
SET notes = content 
WHERE notes IS NULL AND content IS NOT NULL;
