import userz from "@/app/api/apisauce/userz"
import { ActionTypes } from "../constants/action-types"
import { AppDispatch } from ".."
 

export const fetchUsers = (options={}) => async (dispatch:AppDispatch) => {
    const user = await userz.list(options);
    dispatch({
        type: ActionTypes.SET_USERS,
        payload: user
    }) 
} 

 

 