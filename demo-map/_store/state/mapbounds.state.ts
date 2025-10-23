import { MapBounds } from '../../_models/map-bounds.model'

export const initialMapBoundsState: MapBounds = {
    north: 0,
    south: 0,
    west: 0,
    east: 0
};

export function getInitialMapBoundsState():MapBounds {
    return initialMapBoundsState
}