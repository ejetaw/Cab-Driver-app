export interface Database {
  public: {
    Tables: {
      drivers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string;
          license_number: string;
          profile_image?: string;
          rating?: number;
          total_trips?: number;
          member_since?: string;
          status?: 'online' | 'offline';
          registration_source?: 'web' | 'mobile';
          operator_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email: string;
          license_number: string;
          profile_image?: string;
          rating?: number;
          total_trips?: number;
          member_since?: string;
          status?: 'online' | 'offline';
          registration_source?: 'web' | 'mobile';
          operator_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string;
          license_number?: string;
          profile_image?: string;
          rating?: number;
          total_trips?: number;
          member_since?: string;
          status?: 'online' | 'offline';
          registration_source?: 'web' | 'mobile';
          operator_id?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          driver_id: string;
          make: string;
          model: string;
          year: number;
          color: string;
          license_plate: string;
          image?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          make: string;
          model: string;
          year: number;
          color: string;
          license_plate: string;
          image?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          make?: string;
          model?: string;
          year?: number;
          color?: string;
          license_plate?: string;
          image?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          driver_id?: string;
          passenger_id?: string;
          passenger_name?: string;
          passenger_rating?: number;
          passenger_image?: string;
          status: 'pending' | 'accepted' | 'completed' | 'cancelled';
          pickup_address?: string;
          pickup_latitude?: number;
          pickup_longitude?: number;
          dropoff_address?: string;
          dropoff_latitude?: number;
          dropoff_longitude?: number;
          distance?: number;
          duration?: number;
          base_fare?: number;
          commission?: number;
          final_fare?: number;
          fare?: number;
          payment_method?: 'cash' | 'card' | 'wallet';
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          driver_id?: string;
          passenger_id?: string;
          passenger_name?: string;
          passenger_rating?: number;
          passenger_image?: string;
          status?: 'pending' | 'accepted' | 'completed' | 'cancelled';
          pickup_address?: string;
          pickup_latitude?: number;
          pickup_longitude?: number;
          dropoff_address?: string;
          dropoff_latitude?: number;
          dropoff_longitude?: number;
          distance?: number;
          duration?: number;
          base_fare?: number;
          commission?: number;
          final_fare?: number;
          fare?: number;
          payment_method?: 'cash' | 'card' | 'wallet';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          passenger_id?: string;
          passenger_name?: string;
          passenger_rating?: number;
          passenger_image?: string;
          status?: 'pending' | 'accepted' | 'completed' | 'cancelled';
          pickup_address?: string;
          pickup_latitude?: number;
          pickup_longitude?: number;
          dropoff_address?: string;
          dropoff_latitude?: number;
          dropoff_longitude?: number;
          distance?: number;
          duration?: number;
          base_fare?: number;
          commission?: number;
          final_fare?: number;
          fare?: number;
          payment_method?: 'cash' | 'card' | 'wallet';
          updated_at?: string;
        };
      };
      fare_settings: {
        Row: {
          id: string;
          base_fare?: number;
          per_km_rate?: number;
          per_minute_rate?: number;
          commission_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          base_fare?: number;
          per_km_rate?: number;
          per_minute_rate?: number;
          commission_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          base_fare?: number;
          per_km_rate?: number;
          per_minute_rate?: number;
          commission_rate?: number;
          updated_at?: string;
        };
      };
      earnings: {
        Row: {
          id: string;
          driver_id: string;
          date: string;
          trips_count: number;
          total_amount: number;
          commission_amount: number;
          net_amount: number;
          hours_worked: number;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          date: string;
          trips_count: number;
          total_amount: number;
          commission_amount: number;
          net_amount: number;
          hours_worked: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          date?: string;
          trips_count?: number;
          total_amount?: number;
          commission_amount?: number;
          net_amount?: number;
          hours_worked?: number;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
