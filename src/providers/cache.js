const JWT_TOKEN_KEY = "JWT_TOKEN_KEY";
const USER_ID = "USER_ID";
const USER_COMPANIES = "USER_COMPANIES";

export const setToken = (token) => {
  return localStorage.setItem(JWT_TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};

export const clearToken = () => {
  return localStorage.removeItem(JWT_TOKEN_KEY);
};

export const setUserId = (id) => {
  return localStorage.setItem(USER_ID, id);
};

export const getUserId = () => {
  return localStorage.getItem(USER_ID);
};

export const clearUserId = () => {
  return localStorage.removeItem(USER_ID);
};

export const isUserLoggedIn = () => {
  const token = getToken();
  const userId = getUserId();

  return !!token && !!userId;
};

export const setUserCompanies = (payload = []) => {
  return localStorage.setItem(USER_COMPANIES, JSON.stringify(payload));
};

export const getUserCompanies = () => {
  const data = localStorage.getItem(USER_COMPANIES);

  return JSON.parse(data);
};

export const clearUserCompanies = () => {
  return localStorage.removeItem(USER_COMPANIES);
};

export const updateUserCompanies = (payload) => {
  const currentCompanies = getUserCompanies();

  const otherCompanies = currentCompanies.filter((company) => company.id !== payload.id);

  setUserCompanies([...otherCompanies, payload]);
};

export const removeUserCompany = (id) => {
  setUserCompanies([...getUserCompanies().filter((company) => company.id !== id)]);
};
