import { SET_AUTHED_USER, REMOVE_AUTHED_USER } from "../actions/authedUser";
import { Cache } from "../providers";

const reducer = (state = null, action) => {
  switch (action.type) {
    case SET_AUTHED_USER:
      Cache.setToken(action.payload.jwt);
      Cache.setUserId(action.payload.userId);
      return action.payload;
    case REMOVE_AUTHED_USER:
      Cache.clearToken();
      Cache.clearUserId();
      return null;
    default:
      return state;
  }
};

export default reducer;
