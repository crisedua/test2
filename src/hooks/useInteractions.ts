import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Database } from '@/lib/supabase'

type Interaction = Database['public']['Tables']['interactions']['Row']
type InteractionInsert = Database['public']['Tables']['interactions']['Insert']
type InteractionUpdate = Database['public']['Tables']['interactions']['Update']

export function useInteractions() {
  const { user } = useAuth()
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInteractions = async () => {
    if (!user || !supabase) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('interactions')
        .select(`
          *,
          clients (
            id,
            name,
            email
          ),
          opportunities (
            id,
            title
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setInteractions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching interactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchInteractions()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const createInteraction = async (interactionData: Omit<InteractionInsert, 'user_id'>) => {
    if (!user || !supabase) throw new Error('User not authenticated or Supabase not configured')

    try {
      const { data, error } = await supabase
        .from('interactions')
        .insert([{ ...interactionData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      setInteractions(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating interaction'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const updateInteraction = async (id: string, updates: InteractionUpdate) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { data, error } = await supabase
        .from('interactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user!.id)
        .select()
        .single()

      if (error) throw error
      setInteractions(prev => prev.map(interaction => interaction.id === id ? data : interaction))
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating interaction'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const deleteInteraction = async (id: string) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { error } = await supabase
        .from('interactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id)

      if (error) throw error
      setInteractions(prev => prev.filter(interaction => interaction.id !== id))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting interaction'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  const getInteractionsByType = () => {
    return interactions.reduce((acc, interaction) => {
      if (!acc[interaction.type]) {
        acc[interaction.type] = []
      }
      acc[interaction.type].push(interaction)
      return acc
    }, {} as Record<string, Interaction[]>)
  }

  const getInteractionsByClient = (clientId: string) => {
    return interactions.filter(interaction => interaction.client_id === clientId)
  }

  const getInteractionsByOpportunity = (opportunityId: string) => {
    return interactions.filter(interaction => interaction.opportunity_id === opportunityId)
  }

  const getTotalDuration = () => {
    return interactions.reduce((total, interaction) => total + (interaction.duration || 0), 0)
  }

  return {
    interactions,
    loading,
    error,
    createInteraction,
    updateInteraction,
    deleteInteraction,
    getInteractionsByType,
    getInteractionsByClient,
    getInteractionsByOpportunity,
    getTotalDuration,
    refetch: fetchInteractions,
  }
}

