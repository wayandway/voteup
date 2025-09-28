export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      options: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_alt: string | null
          image_url: string | null
          text: string
          vote_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_alt?: string | null
          image_url?: string | null
          text: string
          vote_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_alt?: string | null
          image_url?: string | null
          text?: string
          vote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "options_vote_id_fkey"
            columns: ["vote_id"]
            isOneToOne: false
            referencedRelation: "vote_results"
            referencedColumns: ["vote_id"]
          },
          {
            foreignKeyName: "options_vote_id_fkey"
            columns: ["vote_id"]
            isOneToOne: false
            referencedRelation: "votes"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          created_at: string
          id: string
          option_id: string | null
          participant_token: string
          ranking: number | null
          scale_value: number | null
          vote_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id?: string | null
          participant_token: string
          ranking?: number | null
          scale_value?: number | null
          vote_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string | null
          participant_token?: string
          ranking?: number | null
          scale_value?: number | null
          vote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "vote_results"
            referencedColumns: ["option_id"]
          },
          {
            foreignKeyName: "responses_vote_id_fkey"
            columns: ["vote_id"]
            isOneToOne: false
            referencedRelation: "vote_results"
            referencedColumns: ["vote_id"]
          },
          {
            foreignKeyName: "responses_vote_id_fkey"
            columns: ["vote_id"]
            isOneToOne: false
            referencedRelation: "votes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          profile_image: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          profile_image?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          profile_image?: string | null
          username?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          description: string | null
          expires_at: string | null
          host_id: string
          host_username: string | null
          id: string
          is_open: boolean
          max_selections: number | null
          scale_max: number | null
          scale_min: number | null
          scale_step: number | null
          title: string
          vote_type: Database["public"]["Enums"]["vote_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          expires_at?: string | null
          host_id: string
          host_username?: string | null
          id?: string
          is_open?: boolean
          max_selections?: number | null
          scale_max?: number | null
          scale_min?: number | null
          scale_step?: number | null
          title: string
          vote_type?: Database["public"]["Enums"]["vote_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          expires_at?: string | null
          host_id?: string
          host_username?: string | null
          id?: string
          is_open?: boolean
          max_selections?: number | null
          scale_max?: number | null
          scale_min?: number | null
          scale_step?: number | null
          title?: string
          vote_type?: Database["public"]["Enums"]["vote_type"]
        }
        Relationships: []
      }
    }
    Views: {
      vote_results: {
        Row: {
          avg_ranking: number | null
          avg_scale_value: number | null
          display_order: number | null
          image_url: string | null
          is_open: boolean | null
          option_id: string | null
          option_text: string | null
          response_count: number | null
          scale_max: number | null
          scale_min: number | null
          title: string | null
          total_participants: number | null
          vote_id: string | null
          vote_type: Database["public"]["Enums"]["vote_type"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      vote_type: "single" | "multiple" | "ranking" | "binary" | "scale"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      vote_type: ["single", "multiple", "ranking", "binary", "scale"],
    },
  },
} as const
