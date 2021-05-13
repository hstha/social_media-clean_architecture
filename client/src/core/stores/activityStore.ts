import { makeAutoObservable } from 'mobx';
import agent from '../api/api';
import { Activity } from '../interface/Activity';

export default class ActivityStore {
  activityMap = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  isLoadingActivity = false;
  isDeletingActivity = false;
  
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * @returns {Activity[]} returns activities by sorted by date in acending order
   */
  get activitiesByDate(): Activity[] {
    return Array.from(this.activityMap.values()).sort((a, b) => 
      Date.parse(a.date) - Date.parse(b.date)  
    );
  }

  get groupedActivities(): [string, Activity[]][] {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = activity.date;
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as {[key: string]: Activity[]})
    );
  }

  /**
   * delete the activity of id locally and from server
   * @param {string} id id of the activity that need to be deleted
   */
  public deleteActivity = (id: string): void => {
    this.setDeletingActivity(true);
    agent.Activities.delete(id).then(() => {
      this.activityMap.delete(id);
      this.setSelectedActivity(id);
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      this.setDeletingActivity(false);
    });
  }

  /**
   * updates the given activity locally and in server
   * @param {Activity} updateActivity activity which is to be updated
   */
  public updateActivity = (updateActivity: Activity): void => {
    this.setLoadingActivity(true);
    agent.Activities.update(updateActivity).then(() => {
      this.activityMap.set(updateActivity.id, updateActivity);
      this.setSelectedActivity(updateActivity.id);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setLoadingActivity(false);
    });
  }

  /**
   * adds the given new activity locally and in server
   * @param {Activity} newActivity activity which is to be added or saved
   */
  public saveActivity = (newActivity: Activity): void => {
    this.setLoadingActivity(true);
    agent.Activities.create(newActivity).then(() => {
      this.activityMap.set(newActivity.id, newActivity);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      this.setLoadingActivity(false);
    });
  }

  /**
   * loads the activity either locally and from server
   * @param {string} id id of an activity which is to be loaded
   */
  public loadActivity = async (id: string): Promise<void> => {
    const activity = this.getActivity(id);
    if(activity) {
      this.selectedActivity = activity;
    } else {
      this.setLoadingActivity(true);
      try {
        const activity = await agent.Activities.detail(id);
        this.setActivity(activity);
      } catch (err) {
        console.error(err);
      } finally{
        this.setLoadingActivity(false);
      }
    }
  }

  /**
   * loads the activities from server
   */
  public loadActivities = async (): Promise<void> => {
    this.setLoadingActivity(true);
    try {
      const activities = await agent.Activities.list();
      activities.forEach(activity => {
        this.setActivity(activity);
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.setLoadingActivity(false);
    }
  }

  /**
   * determines if the activities are being loaded or not
   * @param {boolean} isLoading is activity is being loaded or not
   */
  public setLoadingActivity = (isLoading: boolean): void => {
    this.isLoadingActivity = isLoading;
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
  public setActivity = (activity: Activity): void => {
    activity.date = activity.date.split('T')[0];
    this.activityMap.set(activity.id, activity);
  }

  /**
   * sets activity locally
   * @param {string} id id of an activity which is to be set locally
   */
  public setSelectedActivity = (id: string): void => {
    this.selectedActivity = this.getActivity(id);
  }

  /**
   * @param {string} id id of an activity which is to be queried locally
   * @returns activity
   */
  private getActivity = (id: string): Activity | undefined => {
    return this.activityMap.get(id);
  }
}