import { makeAutoObservable } from 'mobx';
import { User, UserFormValues } from '../interface';
import { Authentication } from '../api';
import { store } from './store';
import { history } from '../..';

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }
  
  get isLoggedIn(): boolean {
    return !!this.user && !!this.user.token;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private errorHandle = async (error: any) => {
    return error;
  }

  logout = (): void => {
    store.appStore.setToken(null);
    window.localStorage.removeItem('jwt');
    this.user = null;
    history.push('/');
  };

  public login = async ({ email, password}: UserFormValues): Promise<void> => {
    try {
      const user = await Authentication.login({ email, password });
      this.setUser(user);
      store.modalStore.closeModal();
      history.push('/activities');
    } catch (error) {
      throw this.errorHandle(error);
    }
  }

  public register = async (newUser: UserFormValues): Promise<void> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await Authentication.register(newUser);
      this.setUser(user);
      store.modalStore.closeModal();
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  }

  public getCurrentUser = async (): Promise<void> => {
    try {
      const user = await Authentication.getCurrentUser();
      this.setUser(user);
    } catch (error) {
      throw this.errorHandle(error);
    }
  }

  private setUser = (user: User): void => {
    store.appStore.setToken(user.token);
    this.user = user;
  }
}