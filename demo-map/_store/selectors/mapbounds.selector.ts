import { createFeatureSelector, createSelector } from '@ngrx/store'
import { MapBounds } from '../../_models/map-bounds.model'
import { IAppState } from '../app.state'
import { initialMapBoundsState } from '../state/mapbounds.state'

const mapBoundsState = (state: IAppState) => state.mapBounds;

export const GetMapBounds = createSelector(
    mapBoundsState,
    (state: MapBounds) => state
);


