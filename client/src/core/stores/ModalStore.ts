import { makeAutoObservable } from 'mobx';

interface Modal {
  isOpen: boolean,
  body: JSX.Element | null,
  title: string | null
}

export default class ModalStore {
  public modal: Modal = {
    isOpen: false,
    body: null,
    title: null
  }

  constructor() {
    makeAutoObservable(this);
  }

  public openModal = (content: JSX.Element, title: string): void => {
    this.modal = {
      isOpen: true,
      body: content,
      title: title
    };
  }

  public closeModal = (): void => {
    this.modal = {
      isOpen: false,
      body: null,
      title: null
    };
  }
}