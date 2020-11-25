import { ADD_COMPANIES, ADD_COMPANY, REMOVE_COMPANY, UPDATE_COMPANY } from "../actions/company";

const reducer = (state = [], action) => {
  switch (action.type) {
    case ADD_COMPANY:
      return [...state, action.payload];
    case ADD_COMPANIES:
      return action.payload || [];
    case REMOVE_COMPANY:
      return state.filter((company) => company.id !== action.id);
    case UPDATE_COMPANY:
      return [state.filter((company) => company.id !== action.payload.id), action.payload];
    default:
      return state;
  }
};

export default reducer;
