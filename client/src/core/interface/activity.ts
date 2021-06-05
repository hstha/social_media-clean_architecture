import { Profile } from './profile';

export interface Activity {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUsername: string;
  isCancelled: boolean;
  isGoing: boolean;
  isHost: boolean;
  host: Profile;
  attendees: Profile[]
}

export class ActivityFormValues {
  id?: string = undefined;
  title = '';
  category = '';
  description = '';
  date: Date | null = null;
  city = '';
  venue = '';

  constructor(activity?: ActivityFormValues) {
    if (activity) {
      this.id = activity.id;
      this.title = activity.title;
      this.category = activity.category;
      this.description = activity.description;
      this.date = activity.date;
      this.venue = activity.venue;
      this.city = activity.city;
    }
  }
}

export class Activity implements Activity {
  constructor(activity: ActivityFormValues, userProfile: Profile) {
    Object.assign(this, activity);
    this.hostUsername = userProfile.username;
  }
}