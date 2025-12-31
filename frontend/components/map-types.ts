export interface PlaceResult {
    place_id: number
    lat: string
    lon: string
    display_name: string
}

export interface TripMetadata {
    distance: string
    duration: string
}

export interface BusData {
    id: string
    name: string
    route: string
    routeColor: string
    coordinates: [number, number]
    status: "moving" | "stopped" | "in-station"
    speed: number
    heading: number
    passengers: number
    nextStop: string
    eta: string
}
