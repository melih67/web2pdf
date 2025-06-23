import { createClient } from '@/lib/supabase'

export interface UsageData {
  user_id: string
  conversions_used: number
  last_reset: string
  plan_type: 'free' | 'pro' | 'enterprise'
}

export class UsageTracker {
  private supabase = createClient()

  async getUserUsage(userId: string): Promise<UsageData | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching user usage:', error)
      return null
    }
  }

  async initializeUserUsage(userId: string, planType: 'free' | 'pro' | 'enterprise' = 'free'): Promise<UsageData> {
    const now = new Date().toISOString()
    const usageData: Omit<UsageData, 'user_id'> = {
      conversions_used: 0,
      last_reset: now,
      plan_type: planType
    }

    const { data, error } = await this.supabase
      .from('user_usage')
      .upsert({
        user_id: userId,
        ...usageData
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  async checkUsageLimit(userId: string): Promise<{ canUse: boolean; usage: UsageData; limit: number }> {
    let usage = await this.getUserUsage(userId)
    
    if (!usage) {
      usage = await this.initializeUserUsage(userId)
    }

    // Check if we need to reset monthly usage
    const lastReset = new Date(usage.last_reset)
    const now = new Date()
    const monthsSinceReset = (now.getFullYear() - lastReset.getFullYear()) * 12 + (now.getMonth() - lastReset.getMonth())

    if (monthsSinceReset >= 1) {
      // Reset usage for new month
      usage = await this.resetMonthlyUsage(userId, usage.plan_type)
    }

    const limits = {
      free: 3,
      pro: 100,
      enterprise: Infinity
    }

    const limit = limits[usage.plan_type]
    const canUse = usage.conversions_used < limit

    return { canUse, usage, limit }
  }

  async incrementUsage(userId: string): Promise<UsageData> {
    const { data, error } = await this.supabase
      .from('user_usage')
      .update({
        conversions_used: this.supabase.sql`conversions_used + 1`
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  private async resetMonthlyUsage(userId: string, planType: 'free' | 'pro' | 'enterprise'): Promise<UsageData> {
    const now = new Date().toISOString()
    
    const { data, error } = await this.supabase
      .from('user_usage')
      .update({
        conversions_used: 0,
        last_reset: now,
        plan_type: planType
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  async upgradePlan(userId: string, newPlan: 'pro' | 'enterprise'): Promise<UsageData> {
    const { data, error } = await this.supabase
      .from('user_usage')
      .update({
        plan_type: newPlan
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }
}

export const usageTracker = new UsageTracker()