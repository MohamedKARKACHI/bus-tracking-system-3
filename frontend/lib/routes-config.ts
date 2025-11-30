// Marrakech Bus Routes Configuration
export const MARRAKECH_ROUTES = [
  {
    id: 1,
    number: 'R-01',
    name: 'Jemaa el-Fna → Gueliz',
    fullName: 'Route 1: Jemaa el-Fna → Gueliz',
    color: '#3b82f6',
    startLocation: 'Place Jemaa el-Fna',
    endLocation: 'Quartier Gueliz',
    distance: 8.5,
    duration: 25,
    fare: 7.00,
    stations: [
      { name: 'Jemaa el-Fna', coords: [-7.9892, 31.6258] as [number, number], order: 1, time: '08:00' },
      { name: 'Place de la Liberté', coords: [-7.9988, 31.6295] as [number, number], order: 2, time: '08:07' },
      { name: 'Gueliz Center', coords: [-8.0089, 31.6340] as [number, number], order: 3, time: '08:15' },
      { name: 'Marjane Gueliz', coords: [-8.0156, 31.6380] as [number, number], order: 4, time: '08:20' },
      { name: 'Carré Eden', coords: [-8.0205, 31.6420] as [number, number], order: 5, time: '08:25' },
    ],
  },
  {
    id: 2,
    number: 'R-02',
    name: 'Aéroport Menara → Médina',
    fullName: 'Route 2: Aéroport Menara → Médina',
    color: '#10b981',
    startLocation: 'Aéroport Menara',
    endLocation: 'Médina de Marrakech',
    distance: 12.0,
    duration: 30,
    fare: 10.00,
    stations: [
      { name: 'Aéroport Menara', coords: [-8.0364, 31.6069] as [number, number], order: 1, time: '09:00' },
      { name: 'Hivernage', coords: [-8.0156, 31.6167] as [number, number], order: 2, time: '09:08' },
      { name: 'Koutoubia', coords: [-7.9930, 31.6243] as [number, number], order: 3, time: '09:18' },
      { name: 'Ben Youssef', coords: [-7.9892, 31.6320] as [number, number], order: 4, time: '09:25' },
      { name: 'Bab Doukkala', coords: [-7.9980, 31.6380] as [number, number], order: 5, time: '09:30' },
    ],
  },
  {
    id: 3,
    number: 'R-03',
    name: 'Hivernage → Jardin Majorelle',
    fullName: 'Route 3: Hivernage → Jardin Majorelle',
    color: '#f59e0b',
    startLocation: 'Quartier Hivernage',
    endLocation: 'Jardin Majorelle',
    distance: 6.5,
    duration: 20,
    fare: 6.00,
    stations: [
      { name: 'Hivernage Hotel Zone', coords: [-8.0156, 31.6167] as [number, number], order: 1, time: '10:00' },
      { name: 'Théâtre Royal', coords: [-8.0050, 31.6250] as [number, number], order: 2, time: '10:05' },
      { name: 'Cyber Park', coords: [-7.9988, 31.6350] as [number, number], order: 3, time: '10:12' },
      { name: 'Jardin Majorelle', coords: [-7.9897, 31.6417] as [number, number], order: 4, time: '10:17' },
      { name: 'Palmeraie Mall', coords: [-7.9750, 31.6585] as [number, number], order: 5, time: '10:20' },
    ],
  },
  {
    id: 4,
    number: 'R-04',
    name: 'Gare ONCF → Palmeraie',
    fullName: 'Route 4: Gare ONCF → Palmeraie',
    color: '#8b5cf6',
    startLocation: 'Gare Ferroviaire',
    endLocation: 'La Palmeraie',
    distance: 15.0,
    duration: 35,
    fare: 12.00,
    stations: [
      { name: 'Gare ONCF Marrakech', coords: [-7.9973, 31.6167] as [number, number], order: 1, time: '11:00' },
      { name: 'Bab Doukkala', coords: [-7.9980, 31.6380] as [number, number], order: 2, time: '11:10' },
      { name: 'Jardins Agdal', coords: [-7.9850, 31.6100] as [number, number], order: 3, time: '11:20' },
      { name: 'Palmeraie Golf', coords: [-7.9650, 31.6520] as [number, number], order: 4, time: '11:28' },
      { name: 'Palmeraie Resort', coords: [-7.9550, 31.6650] as [number, number], order: 5, time: '11:35' },
    ],
  },
] as const

export type Route = typeof MARRAKECH_ROUTES[number]
export type Station = Route['stations'][number]

export function getRouteById(id: number) {
  return MARRAKECH_ROUTES.find(route => route.id === id)
}

export function getRouteByNumber(number: string) {
  return MARRAKECH_ROUTES.find(route => route.number === number)
}

export function getRouteName(id: number) {
  return MARRAKECH_ROUTES.find(route => route.id === id)?.name || `Route ${id}`
}

export function getRouteColor(id: number) {
  return MARRAKECH_ROUTES.find(route => route.id === id)?.color || '#3b82f6'
}
