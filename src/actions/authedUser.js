export const SET_AUTHED_USER = "SET_AUTHED_USER";
export const REMOVE_AUTHED_USER = "REMOVE_AUTHED_USER";

export const setAuthedUser = (payload) => ({
  type: SET_AUTHED_USER,
  payload,
});

export const removeAuthedUser = () => ({
  type: REMOVE_AUTHED_USER,
});
