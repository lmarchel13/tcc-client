const JWT_TOKEN_KEY = "JWT_TOKEN_KEY";
const USER_ID = "USER_ID";

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
