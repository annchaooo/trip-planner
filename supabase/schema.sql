-- WanderNote Database Schema
-- Run this in Supabase SQL Editor (supabase.com → Your Project → SQL Editor)

-- Trips table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Destinations table
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  time TIME,
  location TEXT,
  notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('accommodation', 'food', 'transport', 'activities', 'shopping', 'other')),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_destinations_trip_id ON destinations(trip_id);
CREATE INDEX idx_activities_destination_id ON activities(destination_id);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data

-- Trips: Users can CRUD their own trips
CREATE POLICY "Users can view own trips" ON trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON trips
  FOR DELETE USING (auth.uid() = user_id);

-- Destinations: Users can access destinations of their trips
CREATE POLICY "Users can view destinations of own trips" ON destinations
  FOR SELECT USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

CREATE POLICY "Users can create destinations in own trips" ON destinations
  FOR INSERT WITH CHECK (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

CREATE POLICY "Users can update destinations in own trips" ON destinations
  FOR UPDATE USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete destinations in own trips" ON destinations
  FOR DELETE USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

-- Activities: Users can access activities of their destinations
CREATE POLICY "Users can view activities of own trips" ON activities
  FOR SELECT USING (
    destination_id IN (
      SELECT d.id FROM destinations d
      JOIN trips t ON d.trip_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create activities in own trips" ON activities
  FOR INSERT WITH CHECK (
    destination_id IN (
      SELECT d.id FROM destinations d
      JOIN trips t ON d.trip_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update activities in own trips" ON activities
  FOR UPDATE USING (
    destination_id IN (
      SELECT d.id FROM destinations d
      JOIN trips t ON d.trip_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete activities in own trips" ON activities
  FOR DELETE USING (
    destination_id IN (
      SELECT d.id FROM destinations d
      JOIN trips t ON d.trip_id = t.id
      WHERE t.user_id = auth.uid()
    )
  );

-- Expenses: Users can access expenses of their trips
CREATE POLICY "Users can view expenses of own trips" ON expenses
  FOR SELECT USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

CREATE POLICY "Users can create expenses in own trips" ON expenses
  FOR INSERT WITH CHECK (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

CREATE POLICY "Users can update expenses in own trips" ON expenses
  FOR UPDATE USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete expenses in own trips" ON expenses
  FOR DELETE USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER destinations_updated_at BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER activities_updated_at BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
