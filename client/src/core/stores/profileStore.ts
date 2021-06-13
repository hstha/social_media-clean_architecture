import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { Profiles } from '../api/profiles';
import { Photo, Profile, UserActivity } from '../interface';
import { store } from './store';

export default class ProfileStore {
  profile: Profile | null = null;
  isProfileLoading = false;
  usernameToProfileMap = new Map<string, Profile>();
  isUploading = false;
  followings: Profile[] = [];
  isFollowingLoading = false;
  activeTab = 0;
  userActivities: UserActivity[] = [];
  isLoadingActivities = false;

  constructor() {
    makeAutoObservable(this);
    reaction(() => this.activeTab,
      tab => {
        if (tab === 3 || tab === 4) {
          const predicate = tab === 3 ? 'followers' : 'following';
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      });
  }

  loadUserActivities = async (username: string, predicate?: string): Promise<void> => {
    this.isLoadingActivities = true;
    try {
      const activities = await Profiles.listActivities(username, predicate!);
      runInAction(() => {
        this.userActivities = activities;
        this.isLoadingActivities = false;
      });
    } catch (err) {
      runInAction(() => {
        this.isLoadingActivities = false;
      });
    }
  }

  setActiveTab = (index: number): void => {
    this.activeTab = index;
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
  
  updateFollowing = async (username: string, following: boolean): Promise<void> => {
    this.setIsProfileLoading(true);
    try {
      await Profiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
      runInAction(() => {
        if (
          this.profile &&
          this.profile.username !== store.userStore.user?.username &&
          this.profile.username === username
        ) {
          following ? this.profile.followersCount++ : this.profile.followersCount--;
          this.profile.isFollowing = !this.profile.isFollowing;
        }
        if (this.profile && this.profile.username === store.userStore.user?.username) {
          following ? this.profile.followingCount++ : this.profile.followingCount--;
        }
        this.followings.forEach((profile) => {
          if (profile.username === username) {
            profile.isFollowing ? profile.followersCount-- : profile.followersCount++;
            profile.isFollowing = !profile.isFollowing;
          }
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setIsProfileLoading(false);
    }
  };

  loadFollowings = async (predicate: string): Promise<void> => {
    this.setisFollowingLoading(true);
    try {
      const followings = await Profiles.listFollowing(this.profile!.username, predicate);
      runInAction(() => {
        this.followings = followings;
        this.setisFollowingLoading(false);
      });
    } catch (error) {
      this.setisFollowingLoading(false);
    }
  };

  setisFollowingLoading = (isLoading: boolean): void => {
    this.isFollowingLoading = isLoading;
  };
}