import { createSelector } from '@ngrx/store'
import { IAppState } from '../app.state'
import { CurrentUserState } from '../state/currentuser.state'

const currentUserState = (state: IAppState) => state.currentUser;

export const GetCurrentUser = createSelector(
    currentUserState,
    (state: CurrentUserState) => state.user
);

export const GetAccessToken = createSelector(
    currentUserState,
    (state: CurrentUserState) => state.token
);

export const GetUserCategory = createSelector(
    currentUserState,
    (state: CurrentUserState) => state.category
);

export const GetUserBot = createSelector(
    currentUserState,
    (state: CurrentUserState) => state.bot
);

export const IsAuthorised = createSelector(
    currentUserState,
    (state: CurrentUserState) => {return state.token != null}
);