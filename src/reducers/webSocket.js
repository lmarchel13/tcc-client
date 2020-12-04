import { DEFINE_WEB_SOCKET } from "../actions/webSocket";

const reducer = (state = null, action) => {
  switch (action.type) {
    case DEFINE_WEB_SOCKET:
      return action.socket;
    default:
      return state;
  }
};

export default reducer;
