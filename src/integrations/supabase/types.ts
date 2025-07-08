export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          description_en: string | null
          description_it: string | null
          display_order: number | null
          id: string
          image_url: string | null
          info_links: Json | null
          maps_links: Json | null
          title_en: string
          title_it: string
          type_en: string
          type_it: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_it?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          info_links?: Json | null
          maps_links?: Json | null
          title_en: string
          title_it: string
          type_en: string
          type_it: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_it?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          info_links?: Json | null
          maps_links?: Json | null
          title_en?: string
          title_it?: string
          type_en?: string
          type_it?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          setting_type: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          setting_type?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          setting_type?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          cancelled: boolean
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          description_en: string | null
          event_date: string
          event_time: string
          external_link: string | null
          id: string
          image_url: string | null
          location: string
          location_en: string | null
          organizer: string
          organizer_en: string | null
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          cancelled?: boolean
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_en?: string | null
          event_date: string
          event_time: string
          external_link?: string | null
          id?: string
          image_url?: string | null
          location: string
          location_en?: string | null
          organizer: string
          organizer_en?: string | null
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          cancelled?: boolean
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_en?: string | null
          event_date?: string
          event_time?: string
          external_link?: string | null
          id?: string
          image_url?: string | null
          location?: string
          location_en?: string | null
          organizer?: string
          organizer_en?: string | null
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      long_events: {
        Row: {
          cancelled: boolean
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          description_en: string | null
          end_date: string
          event_time: string
          external_link: string | null
          id: string
          image_url: string | null
          location: string
          location_en: string | null
          organizer: string
          organizer_en: string | null
          start_date: string
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          cancelled?: boolean
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_en?: string | null
          end_date: string
          event_time: string
          external_link?: string | null
          id?: string
          image_url?: string | null
          location: string
          location_en?: string | null
          organizer: string
          organizer_en?: string | null
          start_date: string
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          cancelled?: boolean
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_en?: string | null
          end_date?: string
          event_time?: string
          external_link?: string | null
          id?: string
          image_url?: string | null
          location?: string
          location_en?: string | null
          organizer?: string
          organizer_en?: string | null
          start_date?: string
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_first_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
      get_app_setting: {
        Args: { setting_key_param: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      update_app_setting: {
        Args: {
          setting_key_param: string
          setting_value_param: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
