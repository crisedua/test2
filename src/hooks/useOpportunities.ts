import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Database } from '@/lib/supabase'

type Opportunity = Database['public']['Tables']['opportunities']['Row']
type OpportunityInsert = Database['public']['Tables']['opportunities']['Insert']
type OpportunityUpdate = Database['public']['Tables']['opportunities']['Update']

export function useOpportunities() {
  const { user } = useAuth()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOpportunities = async () => {
    if (!user || !supabase) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          clients (
            id,
            name,
            email,
            position
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOpportunities(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching opportunities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchOpportunities()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const createOpportunity = async (opportunityData: Omit<OpportunityInsert, 'user_id'>) => {
    if (!user || !supabase) throw new Error('User not authenticated or Supabase not configured')

    try {
      const { data, error } = await supabase
        .from('opportunities')
        .insert([{ ...opportunityData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      setOpportunities(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating opportunity'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const updateOpportunity = async (id: string, updates: OpportunityUpdate) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user!.id)
        .select()
        .single()

      if (error) throw error
      setOpportunities(prev => prev.map(opp => opp.id === id ? data : opp))
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating opportunity'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const deleteOpportunity = async (id: string) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id)

      if (error) throw error
      setOpportunities(prev => prev.filter(opp => opp.id !== id))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting opportunity'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  const getOpportunitiesByStage = () => {
    return opportunities.reduce((acc, opp) => {
      if (!acc[opp.stage]) {
        acc[opp.stage] = []
      }
      acc[opp.stage].push(opp)
      return acc
    }, {} as Record<string, Opportunity[]>)
  }

  const getTotalValue = () => {
    return opportunities.reduce((total, opp) => total + (opp.value || 0), 0)
  }

  return {
    opportunities,
    loading,
    error,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getOpportunitiesByStage,
    getTotalValue,
    refetch: fetchOpportunities,
  }
}

