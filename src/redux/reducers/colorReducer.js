import * as actionsTypes from "../actions/actionsTypes";
import initialeState from "./initialeState";

export default function colorReducer(state = initialeState.colors, action) {
  switch (action.type) {
    case actionsTypes.SET_COLORS:
      return {
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor,
      };

    default:
      return state;
  }
}
