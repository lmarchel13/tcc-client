import { ADD_CATEGORIES } from "../actions/category";

const reducer = (state = [], action) => {
  switch (action.type) {
    case ADD_CATEGORIES:
      return action.payload || [];
    default:
      return state;
  }
};

export default reducer;
