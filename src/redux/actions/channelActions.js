import * as actionsTypes from "./actionsTypes";

export const setCurrentChannel = (channel) => ({
  type: actionsTypes.SET_CURRENT_CHANNEL,
  payload: {
    currentChannel: channel,
  },
});

export const setPrivateChannel = (isPrivateChannel) => ({
  type: actionsTypes.SET_PRIVATE_CHANNEL,
  payload: {
    isPrivateChannel,
  },
});

export const setUserPosts = (userPosts) => ({
  type: actionsTypes.SET_USER_POSTS,
  payload: {
    userPosts,
  },
});
