import { makeAutoObservable, runInAction } from 'mobx';
import { User, UserFormValues } from '../interface';
import { Authentication } from '../api';
import { store } from './store';
import { history } from '../..';

export default class UserStore {
  user: User | null = null;
  fbAccessToken: string | null = null;
  isFbLoading = false;

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

  public setImage = (image: string): void => {
    if (this.user) this.user.image = image;
  }

  getFBLoginStatus = async (): Promise<void> => {
    window.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        this.fbAccessToken = response.authResponse.accessToken;
      }
    });
  }
 
  facebookLogin = (): void => {
    this.isFbLoading = true;
    const apiLogin = (accessToken: string) => {
      Authentication.fbLogin(accessToken).then(user => {
        store.appStore.setToken(user.token);
        this.setUser(user);
        history.push('/activities');
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        runInAction(() => {
          this.isFbLoading = false;
        });
      });
    };

    if (this.fbAccessToken) {
      apiLogin(this.fbAccessToken);
    } else {
      window.FB.login(response => {
        apiLogin(response.authResponse.accessToken);
      }, { scope: 'public_profile,email' });
    }
  }
}