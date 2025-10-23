import { MapMarkersAction, MapMarkersActionTypes } from '../actions/markers.actions';
import { MapMarkersState, initialMapMarkersState } from '../state/markers.state';
import { Marker } from '../../_models/marker.model'

export function MapMarkersReducer(state = initialMapMarkersState, action: MapMarkersAction) {
    switch (action.type) {
        case MapMarkersActionTypes.Set: {
            return {
                ...state,
                realtors_ids: [...new Set(action.payload.map(marker => marker.realtor_id))] ,
                markers: action.payload.map(marker => ({ ...marker, draggable: false }))
            };
        }
        case MapMarkersActionTypes.Add: {
            const newMarker: Marker = action.payload;
            return {
                ...state,
                realtors_ids: [...new Set([...state.realtors_ids, newMarker.realtor_id])],
                markers: [...state.markers, newMarker]
            };
        }
        case MapMarkersActionTypes.Delete: {
            return {
                ...state,
                realtors_ids: [...new Set([...state.realtors_ids])] ,
                markers: [...state.markers.filter(m => m.id !== action.payload.id)]
            };
        }
        case MapMarkersActionTypes.Tmp: {
            const tmpMarker: Marker = action.payload;
            return {
                ...state,
                tmpMarker: tmpMarker,
            };
        }
        case MapMarkersActionTypes.ClearTmp: {
            return {
                ...state,
                tmpMarker: null,
            };
        }
        case MapMarkersActionTypes.TmpCoords: {
            return {
                ...state,
                tmpMarker: {...state.tmpMarker, latitude:action.payload.latitude, longitude:action.payload.longitude},
            };
        }
        case MapMarkersActionTypes.SetActive: {
            return {
                ...state,
                activeMarker: state.markers.find(marker => marker.id == action.payload)
            };
        }
        case MapMarkersActionTypes.ClearActive: {
            return {
                ...state,
                activeMarker: null
            };
        }
        default:
            return state;
    }
}

export const getMapMarkers = (state: MapMarkersState) => state.markers;
export const getTmpMarker = (state: MapMarkersState) => state.tmpMarker;
