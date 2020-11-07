import * as actionsTypes from "../actions/actionsTypes";
import initialeState from "./initialeState";

export default function (state = initialeState.channel, action) {
  switch (action.type) {
    case actionsTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
      };

    case actionsTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel,
      };

    case actionsTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload.userPosts,
      };

    default:
      return state;
  }
}
