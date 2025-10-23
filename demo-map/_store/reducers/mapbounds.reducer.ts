import { MapBoundsAction, MapBoundsActionTypes } from '../actions/mapbounds.actions';
import { initialMapBoundsState } from '../state/mapbounds.state';

export function MapBoundsReducer(state = initialMapBoundsState, action: MapBoundsAction) {
    switch (action.type) {
        case MapBoundsActionTypes.Set: {
            const bounds = {
                north: action.payload.getNorthEast().lat(),
                south: action.payload.getSouthWest().lat(),
                west: action.payload.getSouthWest().lng(),
                east: action.payload.getNorthEast().lng(),
            }
            return {
                ...state, ...bounds
            };
        }

        default:
            return state;
    }
}