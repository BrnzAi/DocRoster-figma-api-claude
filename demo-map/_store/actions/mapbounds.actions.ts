import { Action } from '@ngrx/store'

export class MapBoundsAction implements Action {
    readonly type
    payload: google.maps.LatLngBounds
}

export enum MapBoundsActionTypes {
    Set = '[MapBounds] Set',
}

export class SetMapBounds implements MapBoundsAction {
    public readonly type = MapBoundsActionTypes.Set;
    constructor(public payload: google.maps.LatLngBounds) {}
}