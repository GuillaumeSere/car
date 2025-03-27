export interface Car {
  id: string;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number;
  images: string[];
  user_id: string;
  created_at: string;
}

export const mockCars: Car[] = [
  {
    id: '1',
    title: 'Peugeot 208 GTI',
    description: 'Voiture en excellent état, entretien régulier, première main. Boîte manuelle, climatisation, GPS intégré.',
    price: 18900,
    year: 2020,
    mileage: 45000,
    images: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60'
    ],
    user_id: 'user1',
    created_at: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Renault Clio V',
    description: 'Clio V récente, faible kilométrage, pack confort complet. Parfaite pour la ville.',
    price: 15900,
    year: 2022,
    mileage: 15000,
    images: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60'
    ],
    user_id: 'user2',
    created_at: '2024-03-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Citroën C3 Aircross',
    description: 'SUV compact parfait pour la famille, coffre spacieux, régulateur de vitesse.',
    price: 21900,
    year: 2021,
    mileage: 30000,
    images: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60'
    ],
    user_id: 'user3',
    created_at: '2024-03-13T09:15:00Z'
  }
];

export const mockUsers = [
  {
    id: 'user1',
    email: 'jean.dupont@email.com',
    name: 'Jean Dupont'
  },
  {
    id: 'user2',
    email: 'marie.martin@email.com',
    name: 'Marie Martin'
  },
  {
    id: 'user3',
    email: 'pierre.durand@email.com',
    name: 'Pierre Durand'
  }
]; 