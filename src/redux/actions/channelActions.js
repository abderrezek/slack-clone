import * as actionsTypes from "./actionsTypes";

export const setCurrentChannel = (channel) => ({
  type: actionsTypes.SET_CURRENT_CHANNEL,
  payload: {
    currentChannel: channel,
  },
});
