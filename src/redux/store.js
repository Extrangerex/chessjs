import { applyMiddleware, combineReducers, createStore } from "redux";
import { authReducer, uiReducer } from "./reducers";
import thunk from "redux-thunk";

const reducers = combineReducers({
  auth: authReducer,
  ui: uiReducer
});

export const store = createStore(reducers, applyMiddleware(thunk));
