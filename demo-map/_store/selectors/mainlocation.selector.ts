import { createSelector } from '@ngrx/store'
import { Location } from '../../_models/location.model'
import { IAppState } from '../app.state'

const mainLocationState = (state: IAppState) => state.mainLocation;

export const GetMainLocation = createSelector(
    mainLocationState,
    (state: Location) => state
);


