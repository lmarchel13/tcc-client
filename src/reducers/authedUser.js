import { SET_AUTHED_USER, REMOVE_AUTHED_USER } from "../actions/authedUser";

const KEY = "authedUser";

const reducer = (state = null, action) => {
  switch (action.type) {
    case SET_AUTHED_USER:
      localStorage.setItem(KEY, action.id);
      return action.id;
    case REMOVE_AUTHED_USER:
      localStorage.removeItem(KEY);
      return null;
    default:
      return state;
  }
};

export default reducer;
