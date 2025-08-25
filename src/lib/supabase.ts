import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Solo crear el cliente si tenemos las credenciales
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          user_id: string
          name: string
          industry: string | null
          website: string | null
          address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          industry?: string | null
          website?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          industry?: string | null
          website?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          company_id: string | null
          name: string
          email: string
          phone: string
          position: string | null
          status: string
          notes: string | null
          lastContact: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id?: string | null
          name: string
          email: string
          phone: string
          position?: string | null
          status?: string
          notes?: string | null
          lastContact?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_id?: string | null
          name?: string
          email?: string
          phone?: string
          position?: string | null
          status?: string
          notes?: string | null
          lastContact?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          user_id: string
          client_id: string
          company_id: string | null
          title: string
          description: string | null
          value: number | null
          stage: string
          probability: number | null
          expected_close_date: string | null
          actual_close_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          company_id?: string | null
          title: string
          description?: string | null
          value?: number | null
          stage?: string
          probability?: number | null
          expected_close_date?: string | null
          actual_close_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          company_id?: string | null
          title?: string
          description?: string | null
          value?: number | null
          stage?: string
          probability?: number | null
          expected_close_date?: string | null
          actual_close_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      interactions: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          opportunity_id: string | null
          type: string
          subject: string
          description: string | null
          date: string
          duration: number | null
          outcome: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          opportunity_id?: string | null
          type: string
          subject: string
          description?: string | null
          date?: string
          duration?: number | null
          outcome?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          opportunity_id?: string | null
          type?: string
          subject?: string
          description?: string | null
          date?: string
          duration?: number | null
          outcome?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          opportunity_id: string | null
          title: string
          description: string | null
          type: string
          priority: string
          status: string
          due_date: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          opportunity_id?: string | null
          title: string
          description?: string | null
          type: string
          priority?: string
          status?: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          opportunity_id?: string | null
          title?: string
          description?: string | null
          type?: string
          priority?: string
          status?: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
