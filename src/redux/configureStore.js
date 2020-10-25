import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./reducers";

export default function configureStore(initialeState) {
  return createStore(rootReducer, initialeState, composeWithDevTools());
}
