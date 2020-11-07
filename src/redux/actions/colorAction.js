import * as actionsTypes from "./actionsTypes";

export const setColors = ({ primary, secondary }) => ({
  type: actionsTypes.SET_COLORS,
  payload: {
    primaryColor: primary,
    secondaryColor: secondary,
  },
});
