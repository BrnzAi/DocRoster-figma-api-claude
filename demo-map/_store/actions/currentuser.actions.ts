import { Action } from '@ngrx/store'
import { Bot } from '@/_models/bot.model'

export class CurrentUserAction implements Action {
  readonly type;
  payload?: any;
}

export enum CurrentUserActionTypes {
  Set = '[CurrentUser] Set',
  Clear = '[CurrentUser] Clear',
  SetCategory = '[CurrentUser] SetCategory',
  SetBot = '[CurrentUser] SetBot',
}

export class SetCurrentUser implements CurrentUserAction {
    public readonly type = CurrentUserActionTypes.Set;
    constructor(public payload: any) {}
}

export class ClearCurrentUser implements CurrentUserAction {
    public readonly type = CurrentUserActionTypes.Clear;
    constructor() {}
}

export class SetUserCategory implements CurrentUserAction {
    public readonly type = CurrentUserActionTypes.SetCategory;
    constructor(public payload: any) {}
}

export class SetUserBot implements CurrentUserAction {
    public readonly type = CurrentUserActionTypes.SetBot;
    constructor(public payload: Bot) {}
}