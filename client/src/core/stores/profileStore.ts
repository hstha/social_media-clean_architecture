import { makeAutoObservable, runInAction } from 'mobx';
import { Profiles } from '../api/profiles';
import { Photo, Profile } from '../interface';
import { store } from './store';

export default class ProfileStore {
  profile: Profile | null = null;
  isProfileLoading = false;
  usernameToProfileMap = new Map<string, Profile>();
  isUploading = false;

  constructor() {
    makeAutoObservable(this);
  }
  
  loadProfile = async (username: string): Promise<void> => {
    this.setIsProfileLoading(true);
    try {
      const profile = await Profiles.get(username);
      this.setProfile(profile);
    } catch (err) {
      console.log(err);
    } finally {
      this.setIsProfileLoading(false);
    }
    
  }
  private setProfile = (profile: Profile): void => {
    this.usernameToProfileMap.set(profile.username, profile);
    this.profile = profile;
  }

  private setIsProfileLoading = (isLoading: boolean): void => {
    this.isProfileLoading = isLoading;
  }

  get isCurrentUser(): Boolean {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }

    return false;
  }

  public uploadPhoto = async (file: Blob): Promise<undefined> => {
    this.setUploading(true);
    try {
      const response = await Profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
      });
    } catch (err) {
      return Promise.reject(err);
    } finally {
      this.setUploading(false);
    }
  }

  public setMainPhoto = async (photo: Photo): Promise<void> => {
    this.setIsProfileLoading(true);
    try {
      await Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find(p => p.isMain)!.isMain = false;
          this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.setIsProfileLoading(false);
    }
  }
  
  private setUploading = (isLoading: boolean): void => {
    this.isUploading = isLoading;
  }

  public deletePhoto = async (photo: Photo): Promise<void> => {
    this.setIsProfileLoading(true);
    try {
      await Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile && this.profile.image) {
          this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id);
        }
      });
    } catch(err) {
      console.error(err);
    } finally {
      this.setIsProfileLoading(false);
    }
  }
}