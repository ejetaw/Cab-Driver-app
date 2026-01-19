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
      drivers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          license_number: string
          vehicle_make: string
          vehicle_model: string
          vehicle_year: string
          vehicle_type: string
          vehicle_colour: string | null
          vehicle_registration: string | null
          profile_image: string | null
          rating: number | null
          total_trips: number | null
          member_since: string | null
          status: string | null
          operator_id: string | null
          registration_source: string | null
          telegram_chat_id: string | null
          address: string | null
          dob: string | null
          ni_number: string | null
          dvla_licence: string | null
          dvla_expiry: string | null
          pco_driver_expiry: string | null
          pco_vehicle_licence: string | null
          pco_vehicle_expiry: string | null
          insurance: string | null
          insurance_expiry: string | null
          mot: string | null
          mot_expiry: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          license_number: string
          vehicle_make: string
          vehicle_model: string
          vehicle_year: string
          vehicle_type: string
          vehicle_colour?: string | null
          vehicle_registration?: string | null
          profile_image?: string | null
          rating?: number | null
          total_trips?: number | null
          member_since?: string | null
          status?: string | null
          operator_id?: string | null
          registration_source?: string | null
          telegram_chat_id?: string | null
          address?: string | null
          dob?: string | null
          ni_number?: string | null
          dvla_licence?: string | null
          dvla_expiry?: string | null
          pco_driver_expiry?: string | null
          pco_vehicle_licence?: string | null
          pco_vehicle_expiry?: string | null
          insurance?: string | null
          insurance_expiry?: string | null
          mot?: string | null
          mot_expiry?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          license_number?: string
          vehicle_make?: string
          vehicle_model?: string
          vehicle_year?: string
          vehicle_type?: string
          vehicle_colour?: string | null
          vehicle_registration?: string | null
          profile_image?: string | null
          rating?: number | null
          total_trips?: number | null
          member_since?: string | null
          status?: string | null
          operator_id?: string | null
          registration_source?: string | null
          telegram_chat_id?: string | null
          address?: string | null
          dob?: string | null
          ni_number?: string | null
          dvla_licence?: string | null
          dvla_expiry?: string | null
          pco_driver_expiry?: string | null
          pco_vehicle_licence?: string | null
          pco_vehicle_expiry?: string | null
          insurance?: string | null
          insurance_expiry?: string | null
          mot?: string | null
          mot_expiry?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string | null
          driver_id: string | null
          operator_id: string | null
          operator_ref: string | null
          pickup: string
          destination: string | null
          pickup_latitude: number | null
          pickup_longitude: number | null
          dropoff_latitude: number | null
          dropoff_longitude: number | null
          date: string
          time: string
          booking_type: string
          vehicle_type: string
          adults: number
          children: number
          infants: number
          luggage: number
          distance: number | null
          duration: string | null
          price: number
          base_fare: number | null
          final_fare: number | null
          commission: number | null
          commission_rate: number | null
          commission_amount: number | null
          net_amount: number | null
          status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
          trip_status: 'dispatch' | 'dispatched' | 'on_route' | 'pob' | 'completed' | null
          payment_method: string | null
          payment_status: 'pending' | 'processing' | 'completed' | 'failed' | null
          passenger_name: string | null
          passenger_email: string | null
          passenger_phone: string | null
          passenger_country_code: string | null
          passenger_image: string | null
          passenger_rating: number | null
          flight_number: string | null
          flight_time: string | null
          flight_terminal: string | null
          departure_airport: string | null
          additional_instructions: string | null
          posted_to_operators: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          driver_id?: string | null
          operator_id?: string | null
          operator_ref?: string | null
          pickup: string
          destination?: string | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          dropoff_latitude?: number | null
          dropoff_longitude?: number | null
          date: string
          time: string
          booking_type: string
          vehicle_type: string
          adults?: number
          children?: number
          infants?: number
          luggage?: number
          distance?: number | null
          duration?: string | null
          price: number
          base_fare?: number | null
          final_fare?: number | null
          commission?: number | null
          commission_rate?: number | null
          commission_amount?: number | null
          net_amount?: number | null
          status?: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
          trip_status?: 'dispatch' | 'dispatched' | 'on_route' | 'pob' | 'completed' | null
          payment_method?: string | null
          payment_status?: 'pending' | 'processing' | 'completed' | 'failed' | null
          passenger_name?: string | null
          passenger_email?: string | null
          passenger_phone?: string | null
          passenger_country_code?: string | null
          passenger_image?: string | null
          passenger_rating?: number | null
          flight_number?: string | null
          flight_time?: string | null
          flight_terminal?: string | null
          departure_airport?: string | null
          additional_instructions?: string | null
          posted_to_operators?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          driver_id?: string | null
          operator_id?: string | null
          operator_ref?: string | null
          pickup?: string
          destination?: string | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          dropoff_latitude?: number | null
          dropoff_longitude?: number | null
          date?: string
          time?: string
          booking_type?: string
          vehicle_type?: string
          adults?: number
          children?: number
          infants?: number
          luggage?: number
          distance?: number | null
          duration?: string | null
          price?: number
          base_fare?: number | null
          final_fare?: number | null
          commission?: number | null
          commission_rate?: number | null
          commission_amount?: number | null
          net_amount?: number | null
          status?: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
          trip_status?: 'dispatch' | 'dispatched' | 'on_route' | 'pob' | 'completed' | null
          payment_method?: string | null
          payment_status?: 'pending' | 'processing' | 'completed' | 'failed' | null
          passenger_name?: string | null
          passenger_email?: string | null
          passenger_phone?: string | null
          passenger_country_code?: string | null
          passenger_image?: string | null
          passenger_rating?: number | null
          flight_number?: string | null
          flight_time?: string | null
          flight_terminal?: string | null
          departure_airport?: string | null
          additional_instructions?: string | null
          posted_to_operators?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          operator_id: string | null
          make: string
          model: string
          year: string
          color: string | null
          registration_number: string | null
          license_number: string | null
          insurance_expiry: string | null
          mot_expiry: string | null
          image: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          operator_id?: string | null
          make: string
          model: string
          year: string
          color?: string | null
          registration_number?: string | null
          license_number?: string | null
          insurance_expiry?: string | null
          mot_expiry?: string | null
          image?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          operator_id?: string | null
          make?: string
          model?: string
          year?: string
          color?: string | null
          registration_number?: string | null
          license_number?: string | null
          insurance_expiry?: string | null
          mot_expiry?: string | null
          image?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      earnings: {
        Row: {
          id: string
          driver_id: string | null
          date: string
          total_amount: number | null
          commission_amount: number | null
          net_amount: number | null
          hours_worked: number | null
          trips_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          driver_id?: string | null
          date: string
          total_amount?: number | null
          commission_amount?: number | null
          net_amount?: number | null
          hours_worked?: number | null
          trips_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          driver_id?: string | null
          date?: string
          total_amount?: number | null
          commission_amount?: number | null
          net_amount?: number | null
          hours_worked?: number | null
          trips_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      fare_settings: {
        Row: {
          id: string
          pricing: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pricing: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pricing?: Json
          created_at?: string
          updated_at?: string
        }
      }
      driver_locations: {
        Row: {
          id: string
          driver_id: string
          latitude: number
          longitude: number
          heading: number | null
          speed: number | null
          accuracy: number | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          driver_id: string
          latitude: number
          longitude: number
          heading?: number | null
          speed?: number | null
          accuracy?: number | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          driver_id?: string
          latitude?: number
          longitude?: number
          heading?: number | null
          speed?: number | null
          accuracy?: number | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Functions: {
      register_driver_safely: {
        Args: {
          p_email: string
          p_name: string
          p_phone?: string
          p_license_number: string
          p_vehicle_make: string
          p_vehicle_model: string
          p_vehicle_year: string
          p_vehicle_type: string
          p_vehicle_colour?: string
          p_vehicle_registration?: string
          p_address?: string
          p_dob?: string
          p_ni_number?: string
          p_dvla_licence?: string
          p_dvla_expiry?: string
          p_pco_driver_expiry?: string
          p_pco_vehicle_licence?: string
          p_pco_vehicle_expiry?: string
          p_insurance?: string
          p_insurance_expiry?: string
          p_mot?: string
          p_mot_expiry?: string
        }
        Returns: string
      }
      get_auth_user_email: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      booking_status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
      trip_status: 'dispatch' | 'dispatched' | 'on_route' | 'pob' | 'completed'
      payment_status: 'pending' | 'processing' | 'completed' | 'failed'
    }
  }
}
