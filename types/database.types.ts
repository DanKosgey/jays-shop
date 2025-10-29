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
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_per_unit: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_per_unit: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_per_unit?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_name: string
          id: string
          order_number: string
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          id?: string
          order_number: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          id?: string
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string
          is_featured: boolean
          name: string
          price: number
          slug: string | null
          stock_quantity: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url: string
          is_featured?: boolean
          name: string
          price: number
          slug?: string | null
          stock_quantity?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_featured?: boolean
          name?: string
          price?: number
          slug?: string | null
          stock_quantity?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          password_changed_at: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          password_changed_at?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_changed_at?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tickets: {
        Row: {
          actual_completion_date: string | null
          actual_cost: number | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_notes: string | null
          customer_phone: string | null
          device_brand: string
          device_imei: string | null
          device_model: string
          device_photos: string[] | null
          device_type: string
          deposit_paid: number | null
          estimated_completion: string | null
          estimated_cost: number | null
          final_cost: number | null
          id: string
          issue_description: string
          notes: string | null
          payment_status: string | null
          priority: Database["public"]["Enums"]["ticket_priority"]
          status: Database["public"]["Enums"]["ticket_status"]
          ticket_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_completion_date?: string | null
          actual_cost?: number | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_notes?: string | null
          customer_phone?: string | null
          device_brand: string
          device_imei?: string | null
          device_model: string
          device_photos?: string[] | null
          device_type: string
          deposit_paid?: number | null
          estimated_completion?: string | null
          estimated_cost?: number | null
          final_cost?: number | null
          id?: string
          issue_description: string
          notes?: string | null
          payment_status?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_number?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_completion_date?: string | null
          actual_cost?: number | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_notes?: string | null
          customer_phone?: string | null
          device_brand?: string
          device_imei?: string | null
          device_model?: string
          device_photos?: string[] | null
          device_type?: string
          deposit_paid?: number | null
          estimated_completion?: string | null
          estimated_cost?: number | null
          final_cost?: number | null
          id?: string
          issue_description?: string
          notes?: string | null
          payment_status?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      admin_dashboard_metrics: {
        Row: {
          out_of_stock_products: number | null
          orders_delivered: number | null
          orders_pending: number | null
          orders_shipped: number | null
          tickets_completed: number | null
          tickets_diagnosing: number | null
          tickets_ready: number | null
          tickets_received: number | null
          tickets_repairing: number | null
          total_admins: number | null
          total_customers: number | null
          total_product_revenue: number | null
          total_products: number | null
          total_repair_revenue: number | null
        }
        Insert: {
          out_of_stock_products?: number | null
          orders_delivered?: number | null
          orders_pending?: number | null
          orders_shipped?: number | null
          tickets_completed?: number | null
          tickets_diagnosing?: number | null
          tickets_ready?: number | null
          tickets_received?: number | null
          tickets_repairing?: number | null
          total_admins?: number | null
          total_customers?: number | null
          total_product_revenue?: number | null
          total_products?: number | null
          total_repair_revenue?: number | null
        }
        Update: {
          out_of_stock_products?: number | null
          orders_delivered?: number | null
          orders_pending?: number | null
          orders_shipped?: number | null
          tickets_completed?: number | null
          tickets_diagnosing?: number | null
          tickets_ready?: number | null
          tickets_received?: number | null
          tickets_repairing?: number | null
          total_admins?: number | null
          total_customers?: number | null
          total_product_revenue?: number | null
          total_products?: number | null
          total_repair_revenue?: number | null
        }
        Relationships: []
      }
      customer_summary: {
        Row: {
          email: string | null
          id: string | null
          last_activity: string | null
          name: string | null
          phone: string | null
          total_lifetime_value: number | null
          total_orders: number | null
          total_spent_on_products: number | null
          total_spent_on_repairs: number | null
          total_tickets: number | null
        }
        Insert: {
          email?: string | null
          id?: string | null
          last_activity?: string | null
          name?: string | null
          phone?: string | null
          total_lifetime_value?: number | null
          total_orders?: number | null
          total_spent_on_products?: number | null
          total_spent_on_repairs?: number | null
          total_tickets?: number | null
        }
        Update: {
          email?: string | null
          id?: string | null
          last_activity?: string | null
          name?: string | null
          phone?: string | null
          total_lifetime_value?: number | null
          total_orders?: number | null
          total_spent_on_products?: number | null
          total_spent_on_repairs?: number | null
          total_tickets?: number | null
        }
        Relationships: []
      }
      order_details: {
        Row: {
          created_at: string | null
          customer_name: string | null
          item_id: string | null
          order_id: string | null
          order_number: string | null
          price_per_unit: number | null
          product_id: string | null
          product_name: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number | null
        }
        Insert: {
          created_at?: string | null
          customer_name?: string | null
          item_id?: string | null
          order_id?: string | null
          order_number?: string | null
          price_per_unit?: number | null
          product_id?: string | null
          product_name?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string | null
          item_id?: string | null
          order_id?: string | null
          order_number?: string | null
          price_per_unit?: number | null
          product_id?: string | null
          product_name?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number | null
        }
        Relationships: []
      }
      product_sales_summary: {
        Row: {
          category: string | null
          id: string | null
          name: string | null
          price: number | null
          stock_quantity: number | null
          total_quantity_sold: number | null
          total_revenue: number | null
          total_sold: number | null
        }
        Insert: {
          category?: string | null
          id?: string | null
          name?: string | null
          price?: number | null
          stock_quantity?: number | null
          total_quantity_sold?: number | null
          total_revenue?: number | null
          total_sold?: number | null
        }
        Update: {
          category?: string | null
          id?: string | null
          name?: string | null
          price?: number | null
          stock_quantity?: number | null
          total_quantity_sold?: number | null
          total_revenue?: number | null
          total_sold?: number | null
        }
        Relationships: []
      }
      ticket_summary: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          device_brand: string | null
          device_model: string | null
          device_type: string | null
          estimated_cost: number | null
          final_cost: number | null
          id: string | null
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          ticket_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          device_brand?: string | null
          device_model?: string | null
          device_type?: string | null
          estimated_cost?: number | null
          final_cost?: number | null
          id?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticket_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          device_brand?: string | null
          device_model?: string | null
          device_type?: string | null
          estimated_cost?: number | null
          final_cost?: number | null
          id?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticket_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status: "pending" | "shipped" | "delivered" | "cancelled"
      ticket_priority: "low" | "normal" | "high" | "urgent"
      ticket_status: "received" | "diagnosing" | "awaiting_parts" | "repairing" | "quality_check" | "ready" | "completed" | "cancelled"
      user_role: "user" | "admin"
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never