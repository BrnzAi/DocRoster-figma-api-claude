import { createSelector } from '@ngrx/store'
import { MapMarkersState } from '../state/markers.state'
import { MapBounds } from '../../_models/map-bounds.model'
import { Marker } from '../../_models/marker.model'
import { IAppState } from '../app.state'

const mapMarkersState = (state: IAppState) => state.mapMarkers;
const mapBoundsState = (state: IAppState) => state.mapBounds;

export const GetMapMarkers = createSelector(
    mapMarkersState,
    (state: MapMarkersState) => state.markers
);

export const GetMapRealtorsIds = createSelector(
    mapMarkersState,
    (state: MapMarkersState) => state.realtors_ids
);

export const GetTmpMarker = createSelector(
    mapMarkersState,
    (state: MapMarkersState) => state.tmpMarker
);

export const GetVisibleMapMarkers = createSelector(
    mapMarkersState,
    mapBoundsState,
    (markerState: MapMarkersState, boundsState: MapBounds):Marker[] => {
        return markerState.markers.filter(marker => {
            return (marker.latitude > boundsState.south && marker.latitude < boundsState.north)
                && (marker.longitude > boundsState.west && marker.longitude < boundsState.east)
        })
    }
);

export const GetVisibleRealtorsIds = createSelector(
    GetVisibleMapMarkers,
    (visibleMarkers: Marker[]) => visibleMarkers.map(marker => marker.realtor_id)
);

export const GetActiveMarker = createSelector(
    mapMarkersState,
    (state: MapMarkersState) => state.activeMarker
);
