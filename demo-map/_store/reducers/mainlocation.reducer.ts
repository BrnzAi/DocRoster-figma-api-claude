import { LocationAction, LocationActionTypes } from '../actions/mainlocation.actions';
import { initialMainLocationState } from '../state/mainlocation.state';

export function MainLocationReducer(state = initialMainLocationState, action: LocationAction) {
    switch (action.type) {
        case LocationActionTypes.Set: {
            return {
                ...state, ...action.payload
            };
        }

        default:
            return state;
    }
}