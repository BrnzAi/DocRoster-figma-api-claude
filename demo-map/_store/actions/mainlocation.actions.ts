import { Action } from '@ngrx/store'
import { Location } from '../../_models/location.model'

export class LocationAction implements Action {
  readonly type;
  payload: Location;
}

export enum LocationActionTypes {
  Set = '[Location] Set',
}

export class SetMainLocation implements LocationAction {
    public readonly type = LocationActionTypes.Set;
    constructor(public payload: Location) {}
}