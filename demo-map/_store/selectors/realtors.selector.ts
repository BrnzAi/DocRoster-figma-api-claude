import { createSelector } from '@ngrx/store'
import { RealtorsState } from '../state/realtors.state'
import { MapMarkersState } from '../state/markers.state'
import { Realtor} from '../../_models/realtor.model'
import { GetVisibleRealtorsIds } from './markers.selector'
import { IAppState } from '../app.state'

const mapMarkersState = (state: IAppState) => state.mapMarkers;
const mapRealtorsState = (state: IAppState) => state.mapRealtors;
const mapBoundsState = (state: IAppState) => state.mapBounds;

export const GetMapRealtors = createSelector(
    mapRealtorsState,
    (state: RealtorsState) => state.realtors
);

export const GetActiveRealtor = createSelector(
    mapRealtorsState,
    (state: RealtorsState) => state.activeRealtor
);

export const GetVisibleRealtors = createSelector(
    mapRealtorsState,
    GetVisibleRealtorsIds,
    (mapRealtors: RealtorsState, visibleRealtorsIds:string[]) => {
        return mapRealtors.realtors.filter(realtor => visibleRealtorsIds.includes(realtor.id))
    }
);


