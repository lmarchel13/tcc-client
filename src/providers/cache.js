const JWT_TOKEN_KEY = "JWT_TOKEN_KEY";

export const setToken = (token) => {
  return localStorage.setItem(JWT_TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};

export const clearToken = () => {
  return localStorage.removeItem(JWT_TOKEN_KEY);
};
