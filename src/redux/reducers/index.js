import { combineReducers } from "redux";

import userReducer from "./userReducer";
import channelReducer from "./channelReducer";
import colorReducer from "./colorReducer";

const rootReducer = combineReducers({
  user: userReducer,
  channel: channelReducer,
  colors: colorReducer,
});

export default rootReducer;
