import { Driver, Trip, EarningPeriod } from '@/types/driver';

export const mockDriver: Driver = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'John Doe',
  phone: '+1 (555) 123-4567',
  email: 'john.doe@example.com',
  profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  rating: 4.8,
  totalTrips: 1248,
  memberSince: 'Jan 2023',
  vehicle: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'Silver',
    licensePlate: 'ABC 123',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  status: 'offline',
  earnings: {
    today: 124.50,
    week: 876.25,
    month: 3245.75,
    total: 28750.50,
  },
};

export const mockTrips: Trip[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    status: 'pending',
    passenger: {
      id: '550e8400-e29b-41d4-a716-446655440020',
      name: 'Alice Smith',
      rating: 4.7,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    pickup: {
      address: '123 Main St, Anytown',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    },
    dropoff: {
      address: '456 Market St, Anytown',
      location: {
        latitude: 37.7831,
        longitude: -122.4039,
      },
    },
    distance: 3.2,
    duration: 12,
    fare: 18.50,
    timestamp: '2025-07-18T14:30:00Z',
    paymentMethod: 'card',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    status: 'completed',
    passenger: {
      id: '550e8400-e29b-41d4-a716-446655440021',
      name: 'Bob Johnson',
      rating: 4.9,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    pickup: {
      address: '789 Oak Ave, Anytown',
      location: {
        latitude: 37.7833,
        longitude: -122.4167,
      },
    },
    dropoff: {
      address: '101 Pine St, Anytown',
      location: {
        latitude: 37.7923,
        longitude: -122.4070,
      },
    },
    distance: 2.8,
    duration: 10,
    fare: 15.75,
    timestamp: '2025-07-18T12:15:00Z',
    paymentMethod: 'cash',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    status: 'completed',
    passenger: {
      id: '550e8400-e29b-41d4-a716-446655440022',
      name: 'Carol Williams',
      rating: 4.6,
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    pickup: {
      address: '222 Elm St, Anytown',
      location: {
        latitude: 37.7800,
        longitude: -122.4200,
      },
    },
    dropoff: {
      address: '333 Cedar Rd, Anytown',
      location: {
        latitude: 37.7900,
        longitude: -122.4100,
      },
    },
    distance: 4.5,
    duration: 18,
    fare: 22.25,
    timestamp: '2025-07-18T10:00:00Z',
    paymentMethod: 'card',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    status: 'completed',
    passenger: {
      id: '550e8400-e29b-41d4-a716-446655440023',
      name: 'David Brown',
      rating: 4.8,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    pickup: {
      address: '444 Maple Dr, Anytown',
      location: {
        latitude: 37.7850,
        longitude: -122.4250,
      },
    },
    dropoff: {
      address: '555 Walnut Blvd, Anytown',
      location: {
        latitude: 37.7950,
        longitude: -122.4150,
      },
    },
    distance: 5.2,
    duration: 22,
    fare: 28.00,
    timestamp: '2025-07-17T18:45:00Z',
    paymentMethod: 'wallet',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    status: 'completed',
    passenger: {
      id: '550e8400-e29b-41d4-a716-446655440024',
      name: 'Eva Garcia',
      rating: 4.5,
      profileImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    pickup: {
      address: '666 Birch Ln, Anytown',
      location: {
        latitude: 37.7860,
        longitude: -122.4260,
      },
    },
    dropoff: {
      address: '777 Spruce Ct, Anytown',
      location: {
        latitude: 37.7960,
        longitude: -122.4160,
      },
    },
    distance: 3.8,
    duration: 15,
    fare: 19.50,
    timestamp: '2025-07-17T15:30:00Z',
    paymentMethod: 'card',
  },
];

export const mockEarnings: EarningPeriod[] = [
  { id: 'earning-001', date: 'Jul 18, 2025', trips: 8, amount: 124.50, hours: 6.5 },
  { id: 'earning-002', date: 'Jul 17, 2025', trips: 10, amount: 156.75, hours: 7.2 },
  { id: 'earning-003', date: 'Jul 16, 2025', trips: 7, amount: 98.25, hours: 5.0 },
  { id: 'earning-004', date: 'Jul 15, 2025', trips: 12, amount: 187.50, hours: 8.5 },
  { id: 'earning-005', date: 'Jul 14, 2025', trips: 9, amount: 142.25, hours: 6.8 },
  { id: 'earning-006', date: 'Jul 13, 2025', trips: 6, amount: 87.75, hours: 4.5 },
  { id: 'earning-007', date: 'Jul 12, 2025', trips: 11, amount: 168.50, hours: 7.8 },
];

export const getPendingTrip = (): Trip | undefined => {
  return mockTrips.find(trip => trip.status === 'pending');
};

export const getCompletedTrips = (): Trip[] => {
  return mockTrips.filter(trip => trip.status === 'completed');
};
