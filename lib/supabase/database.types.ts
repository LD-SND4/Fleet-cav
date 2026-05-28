export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      cargo_photos: {
        Row: {
          captured_time_text: string | null;
          created_at: string;
          id: string;
          location: string | null;
          shipment_id: string;
          title: string;
        };
        Insert: {
          captured_time_text?: string | null;
          created_at?: string;
          id: string;
          location?: string | null;
          shipment_id: string;
          title: string;
        };
        Update: {
          captured_time_text?: string | null;
          created_at?: string;
          id?: string;
          location?: string | null;
          shipment_id?: string;
          title?: string;
        };
        Relationships: [];
      };
      drivers: {
        Row: {
          full_name: string;
          id: string;
        };
        Insert: {
          full_name: string;
          id?: string;
        };
        Update: {
          full_name?: string;
          id?: string;
        };
        Relationships: [];
      };
      fleets: {
        Row: {
          id: string;
          label: string;
          route_name: string;
        };
        Insert: {
          id: string;
          label: string;
          route_name: string;
        };
        Update: {
          id?: string;
          label?: string;
          route_name?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          role: "admin" | "dispatcher" | "driver" | "viewer";
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          role?: "admin" | "dispatcher" | "driver" | "viewer";
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          role?: "admin" | "dispatcher" | "driver" | "viewer";
          updated_at?: string;
        };
        Relationships: [];
      };
      shipment_stops: {
        Row: {
          address: string;
          created_at: string;
          id: string;
          shipment_id: string;
          stop_order: number;
        };
        Insert: {
          address: string;
          created_at?: string;
          id?: string;
          shipment_id: string;
          stop_order: number;
        };
        Update: {
          address?: string;
          created_at?: string;
          id?: string;
          shipment_id?: string;
          stop_order?: number;
        };
        Relationships: [];
      };
      shipments: {
        Row: {
          cargo_summary: string | null;
          created_at: string;
          deliveries_today: number | null;
          distance_km: number | null;
          driver_id: string;
          eta_text: string | null;
          fleet_id: string;
          fuel_cost_usd: number | null;
          fuel_usage_gallons: number | null;
          id: string;
          is_active: boolean;
          status: "On Route" | "Waiting" | "Inactive";
          time_left_text: string | null;
          vehicle_type: "box" | "semi" | "van";
          weight_kg: number | null;
        };
        Insert: {
          cargo_summary?: string | null;
          created_at?: string;
          deliveries_today?: number | null;
          distance_km?: number | null;
          driver_id: string;
          eta_text?: string | null;
          fleet_id: string;
          fuel_cost_usd?: number | null;
          fuel_usage_gallons?: number | null;
          id: string;
          is_active?: boolean;
          status: "On Route" | "Waiting" | "Inactive";
          time_left_text?: string | null;
          vehicle_type: "box" | "semi" | "van";
          weight_kg?: number | null;
        };
        Update: {
          cargo_summary?: string | null;
          created_at?: string;
          deliveries_today?: number | null;
          distance_km?: number | null;
          driver_id?: string;
          eta_text?: string | null;
          fleet_id?: string;
          fuel_cost_usd?: number | null;
          fuel_usage_gallons?: number | null;
          id?: string;
          is_active?: boolean;
          status?: "On Route" | "Waiting" | "Inactive";
          time_left_text?: string | null;
          vehicle_type?: "box" | "semi" | "van";
          weight_kg?: number | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
