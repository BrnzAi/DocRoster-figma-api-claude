import { Marker } from '../../_models/marker.model'

export interface MapMarkersState {
    realtors_ids: any[];
    markers: Marker[];
    tmpMarker?: Marker;
    activeMarker: Marker;
}

export const initialMapMarkersState: MapMarkersState = {
    realtors_ids: [],
    markers: [],
    tmpMarker: null,
    activeMarker: null
};
