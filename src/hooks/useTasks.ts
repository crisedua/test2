import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Database } from '@/lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    if (!user || !supabase) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
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
        .order('due_date', { ascending: true, nullsFirst: false })

      if (error) throw error
      setTasks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const createTask = async (taskData: Omit<TaskInsert, 'user_id'>) => {
    if (!user || !supabase) throw new Error('User not authenticated or Supabase not configured')

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      setTasks(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating task'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const updateTask = async (id: string, updates: TaskUpdate) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      // Si se marca como completada, agregar fecha de completado
      if (updates.status === 'completada' && !updates.completed_at) {
        updates.completed_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user!.id)
        .select()
        .single()

      if (error) throw error
      setTasks(prev => prev.map(task => task.id === id ? data : task))
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating task'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const deleteTask = async (id: string) => {
    if (!supabase) throw new Error('Supabase not configured')
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id)

      if (error) throw error
      setTasks(prev => prev.filter(task => task.id !== id))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting task'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  const getTasksByStatus = () => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = []
      }
      acc[task.status].push(task)
      return acc
    }, {} as Record<string, Task[]>)
  }

  const getTasksByPriority = () => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.priority]) {
        acc[task.priority] = []
      }
      acc[task.priority].push(task)
      return acc
    }, {} as Record<string, Task[]>)
  }

  const getOverdueTasks = () => {
    const now = new Date()
    return tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) < now && 
      task.status !== 'completada'
    )
  }

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getTasksByPriority,
    getOverdueTasks,
    refetch: fetchTasks,
  }
}

