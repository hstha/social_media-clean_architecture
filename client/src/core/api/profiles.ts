import axios, { AxiosResponse } from 'axios';
import { UserActivity, Photo, Profile } from '../interface';
import requests from './api';

export const Profiles = {
  get: (username: string): Promise<Profile> => requests.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob): Promise<AxiosResponse<Photo>> => {
    const formData = new FormData();
    formData.append('File', file);
    return axios.post<Photo>('photos', formData, {
      headers: { 'Content-type': 'multipart/form-data' }
    });
  },
  setMainPhoto: (id: string): Promise<void> => requests.post<void>(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string): Promise<void> => requests.del<void>(`/photos/${id}`),
  updateFollowing: (username: string): Promise<void> => requests.post(`/follow/${username}`, {}),
  listFollowing: (username: string, predicate: string): Promise<Profile[]> =>
    requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
  listActivities: (username: string, predicate: string): Promise<UserActivity[]> =>
    requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
};