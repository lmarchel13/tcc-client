import axios from "axios";

const ENDPOINTS = {
  STATES: `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`,
  CITIES: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios`,
  CEP: `https://viacep.com.br/ws/{CEP}/json/`,
};

const errorHandler = (err = {}) => {
  return { err: err.response && err.response.data ? err.response.data : "Erro desconhecido. Tente novamente" };
};

export const getStates = async () => {
  try {
    const { data } = await axios.get(ENDPOINTS.STATES);

    return {
      data: data.map(({ sigla }) => {
        return { state: sigla };
      }),
    };
  } catch (error) {
    console.log("error", error);
    return errorHandler(error);
  }
};

export const getCitiesByState = async (uf) => {
  try {
    const endpoint = ENDPOINTS.CITIES.replace("{UF}", uf);
    const { data } = await axios.get(endpoint);

    return {
      data: data.map(({ nome }) => {
        return { city: nome };
      }),
    };
  } catch (error) {
    return errorHandler(error);
  }
};

export const getAddressByPostCode = async (postcode) => {
  try {
    const endpoint = ENDPOINTS.CEP.replace("{CEP}", postcode.replace("-", ""));
    const { data } = await axios.get(endpoint);

    return { data };
  } catch (error) {
    return errorHandler(error);
  }
};
