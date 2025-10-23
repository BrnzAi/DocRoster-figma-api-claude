import { Realtor } from '../../_models/realtor.model'

export interface RealtorsState {
  realtors_ids: string[];
  realtors: Realtor[];
  activeRealtor: Realtor;
}

export const initialRealtorsState: RealtorsState = {
    realtors_ids: [],
    realtors: [],
    activeRealtor: null
};
