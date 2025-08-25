import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Database } from '@/lib/supabase'

type Client = Database['public']['Tables']['clients']['Row']
type ClientInsert = Database['public']['Tables']['clients']['Insert']
type ClientUpdate = Database['public']['Tables']['clients']['Update']

export function useClients() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    if (!user || !supabase) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchClients()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const createClient = async (clientData: Omit<ClientInsert, 'user_id'>) => {
    if (!user || !supabase) throw new Error('User not authenticated or Supabase not configured')

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...clientData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      setClients(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating client'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const updateClient = async (id: string, updates: ClientUpdate) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user!.id)
        .select()
        .single()

      if (error) throw error
      setClients(prev => prev.map(client => client.id === id ? data : client))
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating client'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const deleteClient = async (id: string) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id)

      if (error) throw error
      setClients(prev => prev.filter(client => client.id !== id))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting client'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  const searchClients = async (query: string) => {
    if (!user || !supabase) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching clients')
    } finally {
      setLoading(false)
    }
  }

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
    refetch: fetchClients,
  }
}
