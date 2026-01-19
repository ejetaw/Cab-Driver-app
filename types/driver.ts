export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  profileImage: string;
  rating: number;
  totalTrips: number;
  memberSince: string;
  vehicle: Vehicle;
  status: 'online' | 'offline';
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  image: string;
}

export interface Trip {
  id: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  passenger: {
    id: string;
    name: string;
    rating: number;
    profileImage: string;
  };
  pickup: {
    address: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  dropoff: {
    address: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  distance: number;
  duration: number;
  fare: number;
  timestamp: string;
  paymentMethod: 'cash' | 'card' | 'wallet';
}

export interface EarningPeriod {
  id: string;
  date: string;
  trips: number;
  amount: number;
  hours: number;
}
