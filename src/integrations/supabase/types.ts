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
      canonical_sectors: {
        Row: {
          created_at: string
          id: string
          merged_into: string | null
          name: string
          similar_terms: string[] | null
          status: Database["public"]["Enums"]["sector_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          merged_into?: string | null
          name: string
          similar_terms?: string[] | null
          status?: Database["public"]["Enums"]["sector_status"]
        }
        Update: {
          created_at?: string
          id?: string
          merged_into?: string | null
          name?: string
          similar_terms?: string[] | null
          status?: Database["public"]["Enums"]["sector_status"]
        }
        Relationships: [
          {
            foreignKeyName: "canonical_sectors_merged_into_fkey"
            columns: ["merged_into"]
            isOneToOne: false
            referencedRelation: "canonical_sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string
          funding_amount: string
          funding_date: string
          funding_type: string
          headquarter_location: string
          id: string
          name: string
          sector: Database["public"]["Enums"]["company_sector"]
          sub_sector: string
          tags: string[] | null
          website_url: string
        }
        Insert: {
          created_at?: string
          description: string
          funding_amount: string
          funding_date: string
          funding_type: string
          headquarter_location: string
          id?: string
          name: string
          sector: Database["public"]["Enums"]["company_sector"]
          sub_sector: string
          tags?: string[] | null
          website_url: string
        }
        Update: {
          created_at?: string
          description?: string
          funding_amount?: string
          funding_date?: string
          funding_type?: string
          headquarter_location?: string
          id?: string
          name?: string
          sector?: Database["public"]["Enums"]["company_sector"]
          sub_sector?: string
          tags?: string[] | null
          website_url?: string
        }
        Relationships: []
      }
      company_contacts: {
        Row: {
          company_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          title: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          title: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          company_id: string | null
          created_at: string
          description: string
          id: string
          location: string
          title: string
          type: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description: string
          id?: string
          location: string
          title: string
          type: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string
          id?: string
          location?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      location_mappings: {
        Row: {
          created_at: string
          full_form: string
          id: string
          short_form: string
        }
        Insert: {
          created_at?: string
          full_form: string
          id?: string
          short_form: string
        }
        Update: {
          created_at?: string
          full_form?: string
          id?: string
          short_form?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
      user_tracking_preferences: {
        Row: {
          created_at: string
          has_completed_onboarding: boolean | null
          id: string
          locations: Database["public"]["Enums"]["company_location"][] | null
          office_preferences:
            | Database["public"]["Enums"]["office_preference"][]
            | null
          sectors: Database["public"]["Enums"]["company_sector"][] | null
          stages: Database["public"]["Enums"]["company_stage"][] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          has_completed_onboarding?: boolean | null
          id?: string
          locations?: Database["public"]["Enums"]["company_location"][] | null
          office_preferences?:
            | Database["public"]["Enums"]["office_preference"][]
            | null
          sectors?: Database["public"]["Enums"]["company_sector"][] | null
          stages?: Database["public"]["Enums"]["company_stage"][] | null
          user_id: string
        }
        Update: {
          created_at?: string
          has_completed_onboarding?: boolean | null
          id?: string
          locations?: Database["public"]["Enums"]["company_location"][] | null
          office_preferences?:
            | Database["public"]["Enums"]["office_preference"][]
            | null
          sectors?: Database["public"]["Enums"]["company_sector"][] | null
          stages?: Database["public"]["Enums"]["company_stage"][] | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_tag: {
        Args: {
          tag: string
        }
        Returns: string
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      manage_canonical_sector: {
        Args: {
          input_sector: string
          similarity_threshold?: number
        }
        Returns: string
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      company_location:
        | "Abu Dhabi"
        | "Amsterdam"
        | "Arlington"
        | "Atlanta"
        | "Austin"
        | "Bend"
        | "Berlin"
        | "Berwyn"
        | "Boston"
        | "Brooklyn"
        | "Brookline"
        | "Campbell"
        | "Canton"
        | "Charlotte"
        | "Chicago"
        | "Columbus"
        | "Denver"
        | "Des Moines"
        | "Detroit"
        | "Distributed"
        | "Dublin"
        | "Fort Collins"
        | "Foster City"
        | "George Town"
        | "Greenwood Village"
        | "Holmdel"
        | "Irvine"
        | "Jersey City"
        | "Kansas City"
        | "Karlsruhe"
        | "Lehi"
        | "Lewes"
        | "London"
        | "Los Altos"
        | "Los Angeles"
        | "Medellín"
        | "Menlo Park"
        | "Miami"
        | "Middletown"
        | "Munich"
        | "Newton"
        | "New York"
        | "North Miami Beach"
        | "Oakland"
        | "Omaha"
        | "Or Yehuda"
        | "Palo Alto"
        | "Paris"
        | "Phoenix"
        | "Portland"
        | "Raleigh"
        | "Redmond"
        | "Redwood City"
        | "Salt Lake City"
        | "San Francisco"
        | "San Jose"
        | "San Mateo"
        | "San Rafael"
        | "Santa Ana"
        | "Santa Cruz"
        | "São Paulo"
        | "Seattle"
        | "Silver Spring"
        | "Singapore"
        | "Stamford"
        | "Stockholm"
        | "Sunnyvale"
        | "Sydney"
        | "Tel Aviv"
        | "Tokyo"
        | "Toronto"
        | "Vancouver"
        | "Washington"
        | "West Hollywood"
        | "West Palm Beach"
        | "Woodstock"
        | "Youngstown"
      company_sector:
        | "Advertising Technology"
        | "AgTech"
        | "AI"
        | "Automotive"
        | "Blockchain"
        | "Business and Productivity Software"
        | "Business Intelligence"
        | "Childcare Services"
        | "Communication Software"
        | "Construction Technology"
        | "Customer Experience Technology"
        | "Customer Support Technology"
        | "Data Infrastructure"
        | "Developer Tools"
        | "E-Commerce"
        | "EdTech"
        | "Energy"
        | "Entertainment Software"
        | "Event Technology"
        | "Fintech"
        | "FoodTech"
        | "Government Technology"
        | "HealthTech"
        | "Home Services"
        | "HR Tech"
        | "Industrial Technology"
        | "InsurTech"
        | "Legal Tech"
        | "Logistics"
        | "Manufacturing"
        | "Market Intelligence"
        | "Marketing Technology"
        | "Marketplace"
        | "Media and Information Services"
        | "Medical Technology"
        | "Mobility"
        | "Nonprofit Tech"
        | "Procurement Tech"
        | "Professional Training and Coaching"
        | "PropTech"
        | "Recruitment Technology"
        | "Retail Technology"
        | "SaaS"
        | "Sales Tech"
        | "Sustainability Technology"
        | "Travel Technology"
        | "Climate Technology"
        | "Cyber Security"
        | "Aerospace and Defense"
      company_stage:
        | "Pre-Seed"
        | "Seed"
        | "Series A"
        | "Series B"
        | "Series C"
        | "Series D"
        | "Series E"
        | "Growth"
      office_preference: "Full-time Office" | "Hybrid" | "Remote"
      sector_status: "active" | "merged"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
