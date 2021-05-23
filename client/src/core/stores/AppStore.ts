import { makeAutoObservable, reaction } from 'mobx';

type NullableString = string | null;

export default class AppStore {
  errors: NullableString | string[] = null;
  token: NullableString = window.localStorage.getItem('jwt');
  isAppLoaded = false;

  constructor() {
    makeAutoObservable(this);
    reaction(() => this.token, token => {
      if (token) window.localStorage.setItem('jwt', token);
      else window.localStorage.removeItem('jwt');
    });
  }

  public setToken = (token: NullableString): void => {
    this.token = token;
  }

  public setErrors = (errors: NullableString | string[]): void => {
    this.errors = errors;
  }

  public setAppLoadded = (): void => {
    this.isAppLoaded = true;
  }
}