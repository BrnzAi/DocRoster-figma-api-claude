import { Action } from '@ngrx/store'
import { Realtor } from '../../_models/realtor.model'

export class RealtorsAction implements Action {
    readonly type
    payload?: any
}

export enum RealtorsActionTypes {
    Set = '[Realtors] Set',
    SetActive = '[Realtor] SetActive',
    ClearActive = '[Realtor] ClearActive',
}

export class SetRealtors implements RealtorsAction {
    public readonly type = RealtorsActionTypes.Set;
    constructor(public payload: Realtor[]) {}
}

export class SetActiveRealtor implements RealtorsAction {
    public readonly type = RealtorsActionTypes.SetActive;
    constructor(public payload: any) {}
}

export class ClearActiveRealtor implements RealtorsAction {
    public readonly type = RealtorsActionTypes.ClearActive;
    constructor() {}
}