export interface Marker {
    id: number,
    realtor_id: string,
    title: string,
    latitude: number,
    longitude: number,
    image?: string,
    market_report?: string,
    draggable: boolean
}
