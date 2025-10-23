import { CurrentUserAction, CurrentUserActionTypes } from '../actions/currentuser.actions';
import { initialCurrentUserState } from '../state/currentuser.state';

export function CurrentUserReducer(state = initialCurrentUserState, action: CurrentUserAction) {
    switch (action.type) {
        case CurrentUserActionTypes.Set: {
            return {
                ...state, ...action.payload
            };
        }
        
        case CurrentUserActionTypes.Clear: {
            return {
                ...state, user:null, token:null, bot:null, category:null
            };
        }
  
        case CurrentUserActionTypes.SetCategory: {
            return {
                ...state, category: action.payload,
            };
        }
        
        case CurrentUserActionTypes.SetBot: {
            return {
                ...state, bot: action.payload,
            };
        }
        default:
            return state;
    }
}