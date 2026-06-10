// Database types for Supabase

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
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          updated_at?: string
        }
      }
      people: {
        Row: {
          id: string
          user_id: string
          name: string
          avatar_url: string | null
          notes: string | null
          relationship_type: 'family' | 'friend' | 'colleague' | 'mentor' | 'client' | 'partner' | 'neighbor' | 'other'
          relationship_status: 'growing' | 'stable' | 'fading' | 'lost_contact'
          relationship_strength_score: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          avatar_url?: string | null
          notes?: string | null
          relationship_type: 'family' | 'friend' | 'colleague' | 'mentor' | 'client' | 'partner' | 'neighbor' | 'other'
          relationship_status?: 'growing' | 'stable' | 'fading' | 'lost_contact'
          relationship_strength_score?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          avatar_url?: string | null
          notes?: string | null
          relationship_type?: 'family' | 'friend' | 'colleague' | 'mentor' | 'client' | 'partner' | 'neighbor' | 'other'
          relationship_status?: 'growing' | 'stable' | 'fading' | 'lost_contact'
          relationship_strength_score?: number
          updated_at?: string
          deleted_at?: string | null
        }
      }
      interactions: {
        Row: {
          id: string
          person_id: string
          user_id: string
          interaction_type: 'coffee' | 'call' | 'video_call' | 'chat' | 'meal' | 'drinks' | 'activity' | 'event' | 'gift' | 'text' | 'email' | 'other'
          rating: number
          quick_tags: string[]
          free_text_note: string | null
          interaction_date: string
          created_at: string
        }
        Insert: {
          id?: string
          person_id: string
          user_id: string
          interaction_type: 'coffee' | 'call' | 'video_call' | 'chat' | 'meal' | 'drinks' | 'activity' | 'event' | 'gift' | 'text' | 'email' | 'other'
          rating: number
          quick_tags?: string[]
          free_text_note?: string | null
          interaction_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          person_id?: string
          interaction_type?: 'coffee' | 'call' | 'video_call' | 'chat' | 'meal' | 'drinks' | 'activity' | 'event' | 'gift' | 'text' | 'email' | 'other'
          rating?: number
          quick_tags?: string[]
          free_text_note?: string | null
          interaction_date?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color: string
          icon?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          color?: string
          icon?: string | null
        }
      }
      promise_reminders: {
        Row: {
          id: string
          user_id: string
          person_id: string
          title: string
          description: string | null
          deadline: string
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          person_id: string
          title: string
          description?: string | null
          deadline: string
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          deadline?: string
          is_completed?: boolean
          updated_at?: string
        }
      }
      people_tags: {
        Row: {
          person_id: string
          tag_id: string
        }
        Insert: {
          person_id: string
          tag_id: string
        }
        Update: {
          tag_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_relationship_strength: {
        Args: {
          person_id: string
        }
        Returns: number
      }
    }
    Enums: {
      relationship_type: 'family' | 'friend' | 'colleague' | 'mentor' | 'client' | 'partner' | 'neighbor' | 'other'
      relationship_status: 'growing' | 'stable' | 'fading' | 'lost_contact'
      interaction_type: 'coffee' | 'call' | 'video_call' | 'chat' | 'meal' | 'drinks' | 'activity' | 'event' | 'gift' | 'text' | 'email' | 'other'
    }
  }
}

// Convenience types
export type Person = Database['public']['Tables']['people']['Row']
export type PersonInsert = Database['public']['Tables']['people']['Insert']
export type PersonUpdate = Database['public']['Tables']['people']['Update']

export type Interaction = Database['public']['Tables']['interactions']['Row']
export type InteractionInsert = Database['public']['Tables']['interactions']['Insert']
export type InteractionUpdate = Database['public']['Tables']['interactions']['Update']

export type Tag = Database['public']['Tables']['tags']['Row']
export type TagInsert = Database['public']['Tables']['tags']['Insert']
export type TagUpdate = Database['public']['Tables']['tags']['Update']

export type PromiseReminder = Database['public']['Tables']['promise_reminders']['Row']
export type PromiseReminderInsert = Database['public']['Tables']['promise_reminders']['Insert']
export type PromiseReminderUpdate = Database['public']['Tables']['promise_reminders']['Update']

export type User = Database['public']['Tables']['users']['Row']
