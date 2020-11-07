import * as actionsTypes from "../actions/actionsTypes";
import initialeState from "./initialeState";

export default function userReducer(state = initialeState.user, action) {
  switch (action.type) {
    case actionsTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false,
      };

    case actionsTypes.CLEAR_USER:
      return {
        ...initialeState.user,
        isLoading: false,
      };

    default:
      return state;
  }
}
