import { combineReducers } from "@reduxjs/toolkit";
import { accountReducer } from "./accountReducer";
 
const reducers = combineReducers({
   user: accountReducer,
})

export default reducers;