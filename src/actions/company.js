export const ADD_COMPANY = "ADD_COMPANY";
export const REMOVE_COMPANY = "REMOVE_COMPANY";
export const ADD_COMPANIES = "ADD_COMPANIES";
export const UPDATE_COMPANY = "UPDATE_COMPANY";

export const addCompany = (payload) => ({
  type: ADD_COMPANY,
  payload,
});

export const removeCompany = (id) => ({
  type: REMOVE_COMPANY,
  id,
});

export const addCompanies = (payload) => ({
  type: ADD_COMPANIES,
  payload,
});

export const updateCompany = (payload) => ({
  type: UPDATE_COMPANY,
  payload,
});
