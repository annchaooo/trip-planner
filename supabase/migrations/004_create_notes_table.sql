-- Create notes table for journey documentation
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'note', -- 'note', 'essay', 'photo', 'highlight'
  mood TEXT, -- 'happy', 'excited', 'peaceful', 'adventurous', 'tired', 'amazed'
  date DATE NOT NULL,
  location TEXT,
  image_url TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trip notes" ON notes
  FOR SELECT USING (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own trip notes" ON notes
  FOR INSERT WITH CHECK (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own trip notes" ON notes
  FOR UPDATE USING (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own trip notes" ON notes
  FOR DELETE USING (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notes_trip_id ON notes(trip_id);
CREATE INDEX IF NOT EXISTS idx_notes_destination_id ON notes(destination_id);
CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(date);
CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(type);
