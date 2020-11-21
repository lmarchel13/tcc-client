import { ADD_COMPANIES, ADD_COMPANY, REMOVE_COMPANY } from "../actions/company";

const reducer = (state = [], action) => {
  switch (action.type) {
    case ADD_COMPANY:
      return [...state, action.payload];
    case ADD_COMPANIES:
      return action.payload || [];
    case REMOVE_COMPANY:
      return state.filter((company) => company.id !== action.payload.id);
    default:
      return state;
  }
};

export default reducer;
