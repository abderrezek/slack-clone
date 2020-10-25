import * as actionsTypes from "./actionsTypes";

export const setUser = (user) => ({
  type: actionsTypes.SET_USER,
  payload: {
    currentUser: user,
  },
});
