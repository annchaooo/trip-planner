-- Create expenses table for budget tracking
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  date DATE NOT NULL,
  paid_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Users can only see expenses for their own trips
CREATE POLICY "Users can view own trip expenses" ON expenses
  FOR SELECT USING (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

-- Users can insert expenses for their own trips
CREATE POLICY "Users can insert own trip expenses" ON expenses
  FOR INSERT WITH CHECK (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

-- Users can update expenses for their own trips
CREATE POLICY "Users can update own trip expenses" ON expenses
  FOR UPDATE USING (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

-- Users can delete expenses for their own trips
CREATE POLICY "Users can delete own trip expenses" ON expenses
  FOR DELETE USING (
    trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
