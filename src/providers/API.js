import axios from "axios";
import config from "../config";

const instance = axios.create({
  baseURL: config.API_BASE_URL,
});

const errorHandler = (err = {}) => {
  return { err: err.response && err.response.data ? err.response.data : "Erro desconhecido. Tente novamente" };
};

const buildHeaders = ({ token }) => {
  if (!token) {
    throw new Error("Token not provided");
  }

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

export const updateService = async (companyId, serviceId, payload, token) => {
  const endpoint = `/companies/${companyId}/services/${serviceId}`;
  try {
    const { data } = await instance.put(endpoint, payload, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const deleteService = async (serviceId, token) => {
  const endpoint = `/services/${serviceId}`;
  try {
    const { data } = await instance.delete(endpoint, { headers: buildHeaders({ token }) });
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
    return errorHandler(error);
  }
};

export const bookService = async (serviceId, payload, token) => {
  const endpoint = `/services/${serviceId}/book`;

  try {
    const { data } = await instance.post(endpoint, payload, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getTransactionsByDay = async (serviceId, day) => {
  const endpoint = `/transactions?serviceId=${serviceId}&day=${day}`;

  try {
    const { data } = await instance.get(endpoint);
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getServicesByCategory = async (categoryId, { limit = 20, offset = 0 } = {}) => {
  const endpoint = `/categories/${categoryId}/services?limit=${limit}&offset=${offset}`;

  try {
    const { data } = await instance.get(endpoint);
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getCompanies = async ({ limit = 20, offset = 0, term = "" }) => {
  const endpoint = `/companies?limit=${limit}&offset=${offset}&term=${term}`;

  try {
    const { data } = await instance.get(endpoint);
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getDayOffers = async ({ limit = 20, offset = 0 }) => {
  const endpoint = `/services/offers?limit=${limit}&offset=${offset}`;

  try {
    const { data } = await instance.get(endpoint);
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const whoAmI = async ({ jwt: token }) => {
  const endpoint = "/users/me";

  try {
    const { data } = await instance.get(endpoint, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const updateUser = async (payload, token) => {
  const endpoint = "/users";

  try {
    const { data } = await instance.patch(endpoint, payload, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const searchServices = async (term) => {
  const endpoint = `/services/search?term=${term}`;

  try {
    const { data } = await instance.get(endpoint);
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getUserTransactions = async (token) => {
  let buyer, seller;

  try {
    const { data } = await instance.get("/transactions/buyer", { headers: buildHeaders({ token }) });
    buyer = data;
  } catch (error) {
    return errorHandler(error);
  }

  try {
    const { data } = await instance.get("/transactions/seller", { headers: buildHeaders({ token }) });
    seller = data;
  } catch (error) {
    return errorHandler(error);
  }

  return { data: { buyer, seller } };
};

export const deleteTransaction = async (id, token) => {
  try {
    const { data } = await instance.delete(`/transactions/${id}`, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const sendMessage = async (conversationId, payload, token) => {
  try {
    const { data } = await instance.post(`/conversations/${conversationId}/messages`, payload, {
      headers: buildHeaders({ token }),
    });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getMessagesForUser = async ({ companyId, limit = 20, offset = 0 }, token) => {
  const endpoint = `/messages?companyId=${companyId}&limit=${limit}&offset=${offset}`;
  try {
    const { data } = await instance.get(endpoint, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getMessagesForCompanies = async (ids = [], token) => {
  const endpoint = `/companies/messages?ids=${ids.join(",")}`;
  try {
    const { data } = await instance.get(endpoint, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getConversationOrCreate = async (service, token) => {
  const endpoint = "/conversations";

  const payload = {
    companyId: service.company.id,
    serviceId: service.id,
  };

  try {
    const { data } = await instance.post(endpoint, payload, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getConversation = async (service, token) => {
  const endpoint = `/conversations?companyId=${service.company.id}&serviceId=${service.id}`;

  try {
    const { data } = await instance.get(endpoint, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getCompanyConversations = async (token) => {
  const endpoint = `/companies/conversations`;

  try {
    const { data } = await instance.get(endpoint, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getReport = async (report, token) => {
  const endpoint = `/reports?name=${report}`;

  try {
    const { data } = await instance.get(endpoint, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getTransactionsByType = async (type, token) => {
  const endpoint = `/transactions/${type}`;

  try {
    const { data } = await instance.get(endpoint, { headers: buildHeaders({ token }) });
    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};
