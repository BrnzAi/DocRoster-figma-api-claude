import { RealtorsAction, RealtorsActionTypes } from '../actions/realtors.actions';
import { RealtorsState, initialRealtorsState } from '../state/realtors.state';

export function RealtorsReducer(state = initialRealtorsState, action: RealtorsAction) {
    switch (action.type) {
        case RealtorsActionTypes.Set: {
            return {
                ...state, 
                realtors_ids: action.payload.map(realtor => realtor.id),
                realtors: action.payload
            };
        }
        
        case RealtorsActionTypes.SetActive: {
            return {
                ...state, 
                activeRealtor: state.realtors.find(realtor => realtor.id == action.payload)
            };
        }
        
        case RealtorsActionTypes.ClearActive: {
            return {
                ...state, 
                activeRealtor: null
            };
        }
        
        default:
            return state;
    }
}

export const getRealtors = (state: RealtorsState) => state.realtors;