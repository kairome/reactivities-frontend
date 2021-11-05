import axios, { AxiosRequestConfig, Method } from 'axios';

import history from 'utils/history';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const makeRequest = (method: Method) => async <T>(url: string, payload?: T) => {
  const config: AxiosRequestConfig = {
    method,
    url,
  };
  if (method === 'GET') {
    config.params = payload;
  } else {
    config.data = payload;
  }

  try {
    const result = await axiosInstance.request(config);
    return result.data;
  } catch (e: any) {
    const { data, status } = e.response;
    if (status === 401) {
      history.push('/auth');
    }

    throw { data, status };
  }
};

export default {
  get: makeRequest('GET'),
  post: makeRequest('POST'),
  put: makeRequest('PUT'),
  delete: makeRequest('DELETE'),
};
