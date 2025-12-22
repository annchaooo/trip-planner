-- Add budget_currency column to trips table
-- Default to TWD (New Taiwan Dollar) as requested

ALTER TABLE trips
ADD COLUMN IF NOT EXISTS budget_currency TEXT DEFAULT 'TWD';

-- Update existing trips to have TWD as budget currency
UPDATE trips SET budget_currency = 'TWD' WHERE budget_currency IS NULL;
