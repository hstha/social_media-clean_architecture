import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { makeAutoObservable, runInAction } from 'mobx';
import { ChatComment } from '../interface';
import { store } from './store';

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = (activityId: string): void=> {
    if (store.activityStore.selectedActivity) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:5000/chat?activityId=' + activityId, {
          accessTokenFactory: () => store.userStore.user?.token!
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
      
      this.hubConnection.start().catch(err => console.error('Error establishing the connection ', err));
      this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
        runInAction(() => {
          comments.forEach((comment) => comment.createdAt = new Date(comment.createdAt + 'Z'));
          this.comments = comments;
        });
      });
      this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
        runInAction(() => {
          comment.createdAt = new Date(comment.createdAt);
          this.comments.unshift(comment);
        });
      });
    }  
  }

  stopHubConnection = (): void => {
    this.hubConnection?.stop().catch(err => console.error('Error stopping connection: ', err));
  }

  clearComments = (): void => {
    this.comments = [];
    this.stopHubConnection();
  }

  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  addComment = async (values: any): Promise<void> => {
    console.log('sdfsdfsdfsdfsdfsdf');
    values.activityId = store.activityStore.selectedActivity?.id;
    try {
      await this.hubConnection?.invoke('SendComment', values);
    } catch (err) {
      console.error(err);
    }
  }
}