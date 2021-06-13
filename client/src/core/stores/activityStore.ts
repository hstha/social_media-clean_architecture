import { format } from 'date-fns';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { Activities } from '../api';
import { Activity, ActivityFormValues, Profile } from '../interface';
import { Pagination, PagingParams } from '../interface/pagination';
import { store } from './store';

export default class ActivityStore {
  activityMap = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  isActivitiesLoading = false;
  isDeletingActivity = false;
  isLoading = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map<string, boolean | Date>().set('all', true);
  
  constructor() {
    makeAutoObservable(this);
    reaction(() => this.predicate.keys(),
      () => {
        this.pagingParams = new PagingParams();
        this.activityMap.clear();
        this.loadActivities();
      }
    );
  }

  setPagingParams = (pagingParams: PagingParams): void => {
    this.pagingParams = pagingParams;
  }

  setPredicate = (predicate: string, value?: Date): void => {
    const resetPredicate = () => {
      this.predicate.forEach((value, key) => {
        if (key != 'startDate') this.predicate.delete(key);
      });
    };

    switch (predicate) {
      case 'all':
        resetPredicate();
        this.predicate.set('all', true);
        break;
      
      case 'isGoing':
        resetPredicate();
        this.predicate.set('isGoing', true);
        break;
      
      case 'isHost':
        resetPredicate();
        this.predicate.set('isHost', true);
        break;
      
      case 'startDate':
        resetPredicate();
        this.predicate.set('startDate', value!);
        break;
    }
  }

  get axiosParams(): URLSearchParams {
    const params = new URLSearchParams();
    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());

    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, 'true');
      }
    });
    return params;
  }

  /**
   * @returns {Activity[]} returns activities by sorted by date in acending order
   */
  get activitiesByDate(): Activity[] {
    return Array.from(this.activityMap.values()).sort((a, b) => 
      a.date!.getTime() - b.date!.getTime()  
    );
  }

  get groupedActivities(): [string, Activity[]][] {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, 'dd MMM yyyy');
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as {[key: string]: Activity[]})
    );
  }

  /**
   * delete the activity of id locally and from server
   * @param {string} id id of the activity that need to be deleted
   */
  public deleteActivity = (id: string): Promise<void> => {
    this.setDeletingActivity(true);
    return Activities.delete(id).then(() => {
      this.activityMap.delete(id);
      this.setSelectedActivity(id);
    }).catch((err) => {
      return Promise.reject(err);
    }).finally(() => {
      this.setDeletingActivity(false);
    });
  }

  /**
   * updates the given activity locally and in server
   * @param {Activity} updateActivity activity which is to be updated
   */
  public updateActivity = (updateActivity: ActivityFormValues): Promise<Activity | undefined> => {
    const user = store.userStore.user!;
    const userProfile = new Profile(user);
    const activity = new Activity(updateActivity, userProfile);
    return Activities.update(activity).then(() => {
      this.setActivity(updateActivity);

      return Promise.resolve(this.selectedActivity);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  /**
   * adds the given new activity locally and in server
   * @param {Activity} newActivity activity which is to be added or saved
   */
  public saveActivity = (newActivity: ActivityFormValues): Promise<Activity | undefined> => {
    const user = store.userStore.user!;
    
    const userProfile = new Profile(user);
    const activity: Activity = new Activity(newActivity, userProfile);

    return Activities.create(activity).then(() => {
      this.setActivity(newActivity);

      return Promise.resolve(this.selectedActivity);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  /**
   * loads the activity either locally and from server
   * @param {string} id id of an activity which is to be loaded
   */
  public loadActivity = async (id: string): Promise<Activity | undefined> => {
    this.setActivitiesLoading(true);
    const activity = this.getActivity(id);
    if(activity) {
      this.selectedActivity = activity;
      this.setActivitiesLoading(false);
      return Promise.resolve(this.selectedActivity);
    } else {
      try {
        const activity = await Activities.detail(id);
        this.setActivity(activity);
        this.setSelectedActivity(id);

        return Promise.resolve(this.selectedActivity);
      } catch (err) {
        return Promise.reject(err);
      } finally {
        this.setActivitiesLoading(false);
      } 
    }
  }

  /**
   * loads the activities from server
   */
  public loadActivities = async (): Promise<void> => {
    this.setActivitiesLoading(true);
    try {
      const result = await Activities.list(this.axiosParams);
      result.data.forEach(activity => {
        this.setActivity(activity);
      });
      this.setPagination(result.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      this.setActivitiesLoading(false);
    }
  }

  setPagination = (pagination: Pagination): void => {
    this.pagination = pagination;
  }

  /**
   * determines if the activities are being loaded or not
   * @param {boolean} isLoading is activity is being loaded or not
   */
  public setActivitiesLoading = (isLoading: boolean): void => {
    this.isActivitiesLoading = isLoading;
  }

  public setLoading = (isLoading: boolean): void => {
    this.isLoading = isLoading;
  }

  /**
   * determines if the activity is being deleting or not
   * @param isLoading activity is deleting or not
   */
  public setDeletingActivity = (isLoading: boolean): void => {
    this.isDeletingActivity = isLoading;
  }

  /**
   * set the activity locally
   * @param {Activity} activity activity which is to be set
   */
  public setActivity = (activity: ActivityFormValues): void => {
    const user = store.userStore.user!;
    const newActivity: Activity = {...this.getActivity(activity.id!)!, ...activity};
    
    if (!newActivity.hostUsername) {
      newActivity.hostUsername = user.username;
    }

    if (!newActivity.attendees) {
      newActivity.attendees = [new Profile(user)];
    }

    if (!newActivity.isCancelled) {
      newActivity.isCancelled = false;
    }

    newActivity.isGoing = newActivity.attendees!.some(attendee => attendee.username === user.username);
    newActivity.isHost = newActivity.hostUsername === user.username;
    newActivity.host = newActivity.attendees.find(attendee => attendee.username === newActivity.hostUsername)!;
    newActivity.date = new Date(newActivity.date!);

    this.activityMap.set(newActivity.id!, newActivity);
    this.selectedActivity = newActivity;
  }

  /**
   * sets activity locally
   * @param {string} id id of an activity which is to be set locally
   */
  public setSelectedActivity = (id: string | undefined): void => {
    if (!id) {
      this.selectedActivity = undefined;
    } else {
      this.selectedActivity = this.getActivity(id);
    }
  }

  /**
   * @param {string} id id of an activity which is to be queried locally
   * @returns activity
   */
  private getActivity = (id: string): Activity | undefined => {
    return this.activityMap.get(id);
  }

  public attendActivity = async (id: string): Promise<void> => {
    this.setLoading(true);
    const user = store.userStore.user!;
    const profile = store.profileStore.usernameToProfileMap;
    try {
      await Activities.attend(id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(
            attendee => attendee.username != user?.username);
        } else {
          this.selectedActivity?.attendees?.push(profile.get(user.username)!);
          this.selectedActivity!.isGoing = true;
        }
      });
      this.setActivity(this.selectedActivity!);
    } catch (err) {
      return Promise.reject(err);
    } finally {
      this.setLoading(false);
    }
  }

  public cancelActivityToogle = (id: string): Promise<void> => {
    this.setLoading(true);
    return Activities.attend(id).then(() => {
      this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
      this.activityMap.set(id, this.selectedActivity!);

      return Promise.resolve();
    }).catch(err => Promise.reject(err)).finally(() => this.setLoading(false));
  }

  clearSelectedActivity = (): void => {
    this.selectedActivity = undefined;
  }

  updateAttendeeFollowing = (username: string): void => {
    this.activityMap.forEach((activity) => {
      activity.attendees.forEach((attendee) => {
        if (attendee.username === username) {
          attendee.isFollowing ? attendee.followersCount-- : attendee.followersCount++;
          attendee.isFollowing = !attendee.isFollowing;
        }
      });
    });
  };


}

/*
  - add Submit for approval in audit response
  - when this field is true submit for approval even if the required for approval is false
*/