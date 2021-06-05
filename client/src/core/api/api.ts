import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { AppConstant } from '../../appConstant';
import { store } from '../stores/store';

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const { ERROR } = AppConstant;

axios.defaults.baseURL = 'http://localhost:5000/api';

// interceptor for request 
axios.interceptors.request.use((config) => {
  const token = store.appStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * handles rejection
 * @param error error oon failure response
 */
const responseErrorHandler = (error: AxiosError) => {
  const { data, status, config } = error.response!;
  switch (status) {
    case 400:
      if (typeof data === 'string') {
        toast.error(data);
      } else if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
        history.push(ERROR.BAD_STATUS[404]);
      } else if (data.errors) {
        const modalStateErrors = [];
        for (const index in data.errors) {
          if (data.errors[index]) {
            modalStateErrors.push(data.errors[index]);
          }
        }
        throw modalStateErrors.flat();
      }
      break;
    
    case 401:
      toast.error(ERROR.BAD_STATUS[401]);
      break;
    
    case 404:
      history.push(ERROR.BAD_STATUS[404]);
      break;
    
    case 500:
      toast.error(ERROR.BAD_STATUS[500]);
      break;
  }
};

// added error-handling interceptors
axios.interceptors.response.use(async response => {
  await sleep(1000);
  return response;
}, (error: AxiosError) => {
  responseErrorHandler(error);
  return Promise.reject(error);
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string): Promise<T> => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}): Promise<T> => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}): Promise<T> => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string): Promise<T> => axios.delete<T>(url).then(responseBody),
};

export default requests;