import { Activity } from '../interface';
import { PaginatedResult } from '../interface/pagination';
import requests from './api';

export const Activities = {
  list: (params: URLSearchParams): Promise<PaginatedResult<Activity[]>> => requests.get<PaginatedResult<Activity[]>>('/activities', params),
  detail: (id: string): Promise<Activity> => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity): Promise<void> => requests.post<void>('/activities', activity),
  update: (activity: Activity): Promise<void> => requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string): Promise<void> => requests.del<void>(`/activities/${id}`),
  attend: (id: string): Promise<void> => requests.post<void>(`/activities/${id}/attend`, {})
};