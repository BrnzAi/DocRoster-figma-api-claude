import { Location } from '../_models/location.model'
import { initialMainLocationState } from './state/mainlocation.state'
import { MapBounds } from '../_models/map-bounds.model'
import { initialMapBoundsState } from './state/mapbounds.state'
import { initialMapMarkersState, MapMarkersState } from './state/markers.state'
import { initialRealtorsState, RealtorsState } from './state/realtors.state'
import {initialCurrentUserState, CurrentUserState } from './state/currentuser.state'

export interface IAppState {
    mainLocation: Location,
    mapBounds: MapBounds,
    mapMarkers: MapMarkersState,
    mapRealtors: RealtorsState,
    currentUser: CurrentUserState
}

export const initialAppState: IAppState = {
    mainLocation: initialMainLocationState,
    mapBounds: initialMapBoundsState,
    mapMarkers: initialMapMarkersState,
    mapRealtors: initialRealtorsState,
    currentUser: initialCurrentUserState
};

export function getInitialState(): IAppState {
    return initialAppState;
}