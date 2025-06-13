import { createClient } from '@supabase/supabase-js'

// Use environment variables for better security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ysjdkgxdndipwwhzqgrv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzamRrZ3hkbmRpcHd3aHpxZ3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3Nzk2MzUsImV4cCI6MjA2NTM1NTYzNX0.bDOmyeQ-ahOZYGoW0zFyDEfJmCCxscqTSuQ_E5mHsdo'

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Generated Database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      habit_entries: {
        Row: {
          completed: boolean
          created_at: string | null
          date: string
          habit_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          date: string
          habit_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          date?: string
          habit_id?: string
          id?: string
          updated_at?: string | null
        }
      }
      habits: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
      }
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 