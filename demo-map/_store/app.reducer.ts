import { ActionReducerMap } from '@ngrx/store'

import { IAppState } from './app.state'
import { MainLocationReducer } from './reducers/mainlocation.reducer'
import { MapBoundsReducer } from './reducers/mapbounds.reducer'
import { MapMarkersReducer } from './reducers/markers.reducer'
import { RealtorsReducer } from './reducers/realtors.reducer'
import { CurrentUserReducer } from './reducers/currentuser.reducer'

export const appReducers: ActionReducerMap<IAppState, any> = {
    mainLocation: MainLocationReducer,
    mapBounds: MapBoundsReducer,
    mapMarkers: MapMarkersReducer,
    mapRealtors: RealtorsReducer,
    currentUser: CurrentUserReducer
};
