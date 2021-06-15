import { User, UserFormValues } from '../interface';
import requests from './api';

export const Authentication = {
  login: ({ email, password }: UserFormValues): Promise<User> => requests.post('/account/login', {email, password}),
  register: (user: UserFormValues): Promise<User> => requests.post('/account/register', user),
  getCurrentUser: (): Promise<User> => requests.get('/account'),
  fbLogin: (accessToken: string): Promise<User> => requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`, {}),
  refreshToken: (): Promise<User> => requests.post<User>('/account/refreshToken', {})
};