import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import MetronomeReducer from "./reducers/metronome";
import { ReduxState } from "../types/redux";

const reducers = combineReducers<ReduxState>({ metronome: MetronomeReducer });

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
