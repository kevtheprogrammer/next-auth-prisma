import { ActionTypes } from "../constants/action-types";

export interface UserState {
    users: []|null;
    selected_user: null;
}

const initialState: UserState = {
    users: [],
    selected_user: null,
};


interface ActionT {
    type: string;
    payload?: any;
}

export const accountReducer = (state = initialState, 
    action: ActionT

) => {
    switch (action.type) { 
     
        case ActionTypes.SET_USERS:
            return { ...state, users: action.payload };
        case ActionTypes.SET_SELECTED_USER:
            return { ...state, selected_user: action.payload }; 
        default:
            return state;
    }
}

