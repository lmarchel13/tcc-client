import axios from "axios";
import config from "../config";

const instance = axios.create({
  baseURL: config.API_BASE_URL,
});

export const errorHandler = (err) => {
  return { err: err.response.data };
};

export const register = async (payload) => {
  const endpoint = `/users/signup`;

  try {
    const { data } = await instance.post(endpoint, payload);
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const login = async (payload) => {
  const endpoint = `/users/signin`;

  try {
    const { data } = await instance.post(endpoint, payload);
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};
