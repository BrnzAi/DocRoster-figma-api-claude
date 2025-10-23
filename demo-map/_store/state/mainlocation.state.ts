import { Location } from '../../_models/location.model'

export const initialMainLocationState: Location = {
    latitude: 49.25714411176102,
    longitude: -123.08969250967098,
    zoom:10
};

export function getInitialMainLocationState():Location {
    return initialMainLocationState
}
