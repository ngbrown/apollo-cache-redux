import { merge } from './merge';
import { Reducer } from 'redux';
import {
    APOLLO_OVERWRITE,
    APOLLO_RESET,
    APOLLO_WRITE
} from "./constants";

const initialState: any = {};

export function apolloReducer(state = initialState, action: any): Reducer<any> {
    switch(action.type) {
        case APOLLO_RESET:
            return initialState;
        case APOLLO_OVERWRITE:
            return action.data;
        case APOLLO_WRITE:
            return merge(state, action.data);
        default:
            return state;
    }
}
