export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      cargo_photos: {
        Row: {
          captured_time_text: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
          location: string | null;
          shipment_id: string;
          title: string;
        };
        Insert: {
          captured_time_text?: string | null;
          created_at?: string;
          id: string;
          image_url?: string | null;
          location?: string | null;
          shipment_id: string;
          title: string;
        };
        Update: {
          captured_time_text?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          location?: string | null;
          shipment_id?: string;
          title?: string;
        };
        Relationships: [];
      };
      drivers: {
        Row: {
          created_at: string;
          full_name: string;
          id: string;
          license_number: string | null;
          phone_number: string | null;
        };
        Insert: {
          created_at?: string;
          full_name: string;
          id?: string;
          license_number?: string | null;
          phone_number?: string | null;
        };
        Update: {
          created_at?: string;
          full_name?: string;
          id?: string;
          license_number?: string | null;
          phone_number?: string | null;
        };
        Relationships: [];
      };
      driver_events: {
        Row: {
          created_at: string;
          description: string | null;
          driver_id: string;
          event_type: "STOP" | "DELAY" | "ROUTE_CHANGE" | "BREAK" | "EMERGENCY";
          id: string;
          shipment_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          driver_id: string;
          event_type: "STOP" | "DELAY" | "ROUTE_CHANGE" | "BREAK" | "EMERGENCY";
          id?: string;
          shipment_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          driver_id?: string;
          event_type?: "STOP" | "DELAY" | "ROUTE_CHANGE" | "BREAK" | "EMERGENCY";
          id?: string;
          shipment_id?: string;
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
      permission_requests: {
        Row: {
          id: string;
          notes: string | null;
          requested_at: string;
          requested_role_id: number;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: "pending" | "approved" | "rejected";
          user_id: string;
        };
        Insert: {
          id?: string;
          notes?: string | null;
          requested_at?: string;
          requested_role_id: number;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: "pending" | "approved" | "rejected";
          user_id: string;
        };
        Update: {
          id?: string;
          notes?: string | null;
          requested_at?: string;
          requested_role_id?: number;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: "pending" | "approved" | "rejected";
          user_id?: string;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          created_at: string | null;
          id: number;
          name: "admin" | "dispatcher" | "driver" | "viewer";
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: "admin" | "dispatcher" | "driver" | "viewer";
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: "admin" | "dispatcher" | "driver" | "viewer";
        };
        Relationships: [];
      };
      shipment_stops: {
        Row: {
          address: string;
          arrived_at: string | null;
          completed: boolean;
          created_at: string;
          departed_at: string | null;
          id: string;
          latitude: number | null;
          longitude: number | null;
          shipment_id: string;
          stop_order: number;
        };
        Insert: {
          address: string;
          arrived_at?: string | null;
          completed?: boolean;
          created_at?: string;
          departed_at?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          shipment_id: string;
          stop_order: number;
        };
        Update: {
          address?: string;
          arrived_at?: string | null;
          completed?: boolean;
          created_at?: string;
          departed_at?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          shipment_id?: string;
          stop_order?: number;
        };
        Relationships: [];
      };
      shipments: {
        Row: {
          average_speed_kmh: number | null;
          cargo_summary: string | null;
          created_at: string;
          current_latitude: number | null;
          current_longitude: number | null;
          delivered_at: string | null;
          deliveries_today: number | null;
          distance_km: number | null;
          driver_id: string;
          eta_text: string | null;
          fleet_id: string;
          fuel_cost_usd: number | null;
          fuel_efficiency_km_per_gallon: number | null;
          fuel_usage_gallons: number | null;
          id: string;
          is_active: boolean;
          started_at: string | null;
          status: "On Route" | "Waiting" | "Inactive";
          temperature_celsius: number | null;
          time_left_text: string | null;
          updated_at: string;
          vehicle_type: "box" | "semi" | "van";
          weight_kg: number | null;
        };
        Insert: {
          average_speed_kmh?: number | null;
          cargo_summary?: string | null;
          created_at?: string;
          current_latitude?: number | null;
          current_longitude?: number | null;
          delivered_at?: string | null;
          deliveries_today?: number | null;
          distance_km?: number | null;
          driver_id: string;
          eta_text?: string | null;
          fleet_id: string;
          fuel_cost_usd?: number | null;
          fuel_efficiency_km_per_gallon?: number | null;
          fuel_usage_gallons?: number | null;
          id: string;
          is_active?: boolean;
          started_at?: string | null;
          status: "On Route" | "Waiting" | "Inactive";
          temperature_celsius?: number | null;
          time_left_text?: string | null;
          updated_at?: string;
          vehicle_type: "box" | "semi" | "van";
          weight_kg?: number | null;
        };
        Update: {
          average_speed_kmh?: number | null;
          cargo_summary?: string | null;
          created_at?: string;
          current_latitude?: number | null;
          current_longitude?: number | null;
          delivered_at?: string | null;
          deliveries_today?: number | null;
          distance_km?: number | null;
          driver_id?: string;
          eta_text?: string | null;
          fleet_id?: string;
          fuel_cost_usd?: number | null;
          fuel_efficiency_km_per_gallon?: number | null;
          fuel_usage_gallons?: number | null;
          id?: string;
          is_active?: boolean;
          started_at?: string | null;
          status?: "On Route" | "Waiting" | "Inactive";
          temperature_celsius?: number | null;
          time_left_text?: string | null;
          updated_at?: string;
          vehicle_type?: "box" | "semi" | "van";
          weight_kg?: number | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          granted_at: string;
          granted_by: string | null;
          role_id: number;
          user_id: string;
        };
        Insert: {
          granted_at?: string;
          granted_by?: string | null;
          role_id: number;
          user_id: string;
        };
        Update: {
          granted_at?: string;
          granted_by?: string | null;
          role_id?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      vehicle_telemetry: {
        Row: {
          engine_temperature: number | null;
          fuel_level_percent: number | null;
          heading: number | null;
          id: string;
          latitude: number;
          longitude: number;
          recorded_at: string;
          shipment_id: string;
          speed_kmh: number | null;
        };
        Insert: {
          engine_temperature?: number | null;
          fuel_level_percent?: number | null;
          heading?: number | null;
          id?: string;
          latitude: number;
          longitude: number;
          recorded_at?: string;
          shipment_id: string;
          speed_kmh?: number | null;
        };
        Update: {
          engine_temperature?: number | null;
          fuel_level_percent?: number | null;
          heading?: number | null;
          id?: string;
          latitude?: number;
          longitude?: number;
          recorded_at?: string;
          shipment_id?: string;
          speed_kmh?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      user_permissions: {
        Row: {
          email: string | null;
          role_name: "admin" | "dispatcher" | "driver" | "viewer" | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_current_user_permissions: {
        Args: Record<PropertyKey, never>;
        Returns: {
          email: string | null;
          role_name: "admin" | "dispatcher" | "driver" | "viewer" | null;
          user_id: string | null;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
