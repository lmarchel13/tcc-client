import axios from "axios";
import config from "../config";

const instance = axios.create({
  baseURL: config.API_BASE_URL,
});

const errorHandler = (err = {}) => {
  return { err: err.response && err.response.data ? err.response.data : "Erro desconhecido. Tente novamente" };
};

const buildHeaders = ({ token }) => {
  return {
    Authorization: `Bearer ${token}`,
  };
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

export const getCategories = async () => {
  const endpoint = `/categories`;

  try {
    const { data } = await instance.get(endpoint);
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getUserCompanies = async ({ token }) => {
  const endpoint = `/companies/my-companies`;

  try {
    const { data } = await instance.get(endpoint, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getPlans = async () => {
  const endpoint = "/plans";

  try {
    const { data } = await instance.get(endpoint);
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const createCompany = async (payload, token) => {
  const endpoint = "/companies";

  try {
    const { data } = await instance.post(endpoint, payload, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const updateCompany = async (id, payload, token) => {
  const endpoint = `/companies/${id}`;

  try {
    const { data } = await instance.patch(endpoint, payload, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const deleteCompany = async (id, token) => {
  const endpoint = `/companies/${id}`;
  try {
    await instance.delete(endpoint, { headers: buildHeaders({ token }) });
    return {};
  } catch (error) {
    return errorHandler(error);
  }
};

export const getCompanyServices = async (id) => {
  const endpoint = `/companies/${id}/services`;
  try {
    const { data } = await instance.get(endpoint);
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const createService = async (companyId, payload, token) => {
  const endpoint = `/companies/${companyId}/services`;
  try {
    const { data } = await instance.post(endpoint, payload, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getService = async (id) => {
  const endpoint = `/services/${id}`;

  try {
    const { data } = await instance.get(endpoint);
    return { data };
  } catch (error) {
    console.log("error", error);
    return errorHandler(error);
  }
};
