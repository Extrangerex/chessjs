import { applyMiddleware, combineReducers, createStore } from "redux";
import { authReducer, gameReducer, uiReducer } from "./reducers";
import thunk from "redux-thunk";

const reducers = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  game: gameReducer
});

export const store = createStore(reducers, applyMiddleware(thunk));
