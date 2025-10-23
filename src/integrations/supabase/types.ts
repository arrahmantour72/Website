import { PathString } from "react-hook-form";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          password: string;
          role: Database["public"]["Enums"]["app_role"]; // 'admin' | 'user'
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email: string;
          password: string;
          role?: Database["public"]["Enums"]["app_role"];
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
        Relationships: [];
      };

      // ✅ Move packages here inside Tables
      packages: {
        Row: {
          id: string;
          title: string | null;
          description: string | null;
          location: string | null;
          price: number | null;
          duration: string | null;
          category: string | null;
          featured: boolean | null;
          dates: string | null;
          image_url: string | null;
          itinerary: string[] | null;
          inclusions: string[] | null;
          exclusions: string[] | null;
          accommodations: {
            hotel_name: string;
            city: string;
            rating?: number;
            amenities?: string[];
            description?: string;
          }[];
          key_locations: string[] | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title?: string | null;
          description?: string | null;
          location?: string | null;
          price?: number | null;
          duration?: string | null;
          category?: string | null;
          featured?: boolean | null;
          dates?: string | null;
          image_url?: string | null;
          itinerary?: string[] | null;
          inclusions?: string[] | null;
          exclusions?: string[] | null;
          accommodations: {
            hotel_name: string;
            city: string;
            rating?: number;
            amenities?: string[];
            description?: string;
          }[];
          key_locations?: string[] | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["packages"]["Insert"]>;
        Relationships: [];
      };
      // ✅ Move destinations here inside Tables
      destinations: {
        Row: {
          _id: string;
          title: string;
          description: string | null;
          imagebase64: string;
          categories: PathString | null;
          services: string[] | null;
          type: string | null;
          featured: boolean | null;
          createdat: string | null;
          updatedat: string | null;
        };
        Insert: {
          _id?: string;
          title: string;
          description?: string | null;
          imageBase64: string;
          categories?: string | null;
          featured: boolean | null;
          services?: string[] | null;
          createdat?: string | null;
          updatedat?: string | null;
           type: string | null;
        };
        Update: {
          _id?: string;
          title?: string;
          description?: string | null;
          imageBase64?: string;
          categories?: string | null;
          featured: boolean | null;
          services?: string[] | null;
          createdat?: string | null;
          updatedat?: string | null;
           type: string | null;
        };
        Relationships: [];
      };

      home: {
        Row: {
          id: string;
          headline: string | null;
          subheading: string | null;
          background_media: string | null;
          media_type: 'image' | 'video' | null;
          cta_buttons: { id: string; text: string; link: string }[] | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          headline?: string | null;
          subheading?: string | null;
          background_media?: string | null;
          media_type?: 'image' | 'video' | null;
          cta_buttons?: { id: string; text: string; link: string }[] | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<{
          id: string;
          headline: string | null;
          subheading: string | null;
          background_media: string | null;
          media_type: 'image' | 'video' | null;
          cta_buttons: { id: string; text: string; link: string }[] | null;
          created_at: string | null;
          updated_at: string | null;
        }>;
        Relationships: [];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };

    Enums: {
      app_role: "admin" | "user";
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
