import { Activity } from '../interface/Activity';
import requests from './api';

export const Activities = {
  list: (): Promise<Activity[]> => requests.get<Activity[]>('/activities'),
  detail: (id: string): Promise<Activity> => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity): Promise<void> => requests.post<void>('/activities', activity),
  update: (activity: Activity): Promise<void> => requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string): Promise<void> => requests.del<void>(`/activities/${id}`)
};