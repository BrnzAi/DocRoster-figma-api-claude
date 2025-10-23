import { Action } from '@ngrx/store'
import { Marker } from '../../_models/marker.model'

export class MapMarkersAction implements Action {
    readonly type
    payload?: any
}

export enum MapMarkersActionTypes {
    Set = '[MapMarkers] Set',
    Add = '[MapMarkers] Add',
    Delete = '[MapMarkers] Delete',
    Tmp = '[MapMarkers] Tmp Marker',
    ClearTmp = '[MapMarkers] Clear Tmp Marker',
    TmpCoords = '[MapMarkers] Tmp Marker coords update',
    SetActive = '[MapMarkers] SetActive',
    ClearActive = '[MapMarkers] ClearActive',
}

export class SetMapMarkers implements MapMarkersAction {
    public readonly type = MapMarkersActionTypes.Set;
    constructor(public payload: Marker[]) {}
}

export class AddMapMarker implements MapMarkersAction {
    public readonly type = MapMarkersActionTypes.Add;
    constructor(public payload: Marker) {}
}

export class DeleteMapMarker implements MapMarkersAction {
    public readonly type = MapMarkersActionTypes.Delete;
    constructor(public payload: Marker) {}
}

export class AddTmpMarker implements MapMarkersAction {
    public readonly type = MapMarkersActionTypes.Tmp;
    constructor(public payload: Marker) {}
}

export class ClearTmpMarker implements MapMarkersAction {
    public readonly type = MapMarkersActionTypes.ClearTmp;
    constructor() {}
}

export class UpdateTmpMarkerCoords implements MapMarkersAction {
    public readonly type = MapMarkersActionTypes.TmpCoords;
    constructor(public payload: any) {}
}

export class SetActiveMarker implements MapMarkersAction {
    public readonly type = MapMarkersActionTypes.SetActive;
    constructor(public payload: any) {}
}

export class ClearActiveMarker implements MapMarkersAction {
    public readonly type = MapMarkersActionTypes.ClearActive;
    constructor() {}
}
