-- Create user_usage table for tracking PDF conversion limits
CREATE TABLE IF NOT EXISTS user_usage (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversions_used INTEGER DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  plan_type VARCHAR(20) DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own usage data
CREATE POLICY "Users can view own usage data" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to update their own usage data
CREATE POLICY "Users can update own usage data" ON user_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own usage data
CREATE POLICY "Users can insert own usage data" ON user_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_usage_updated_at
    BEFORE UPDATE ON user_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();