import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { store } from '../stores/store';

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { data, status, config } = error.response!;
  switch (status) {
    case 400:
      if (typeof data === 'string') {
        toast.error(data);
      } else if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
        history.push('/not-found');
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
      toast.error('unauthorised');
      break;
    
    case 404:
      history.push('/not-found');
      break;
    
    case 500:
      toast.error('server error');
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  post: <T>(url: string, body: {}): Promise<T> => axios.post<T>(url, body).then(responseBody),
  // eslint-disable-next-line @typescript-eslint/ban-types
  put: <T>(url: string, body: {}): Promise<T> => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string): Promise<T> => axios.delete<T>(url).then(responseBody),
};

export default requests;