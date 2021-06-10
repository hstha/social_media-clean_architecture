import { createContext, useContext } from 'react';
import ActivityStore from './activityStore';
import AppStore from './AppStore';
import CommentStore from './commentStore';
import ModalStore from './ModalStore';
import ProfileStore from './profileStore';
import UserStore from './UserStore';

interface Store {
  activityStore: ActivityStore,
  userStore: UserStore,
  appStore: AppStore,
  modalStore: ModalStore,
  profileStore: ProfileStore,
  commentStore: CommentStore
}

//a common end of store
export const store: Store = {
  activityStore: new ActivityStore(),
  userStore: new UserStore(),
  appStore: new AppStore(),
  modalStore: new ModalStore(),
  profileStore: new ProfileStore(),
  commentStore: new CommentStore()
};

export const StoreContext = createContext(store);

//a hook to use store
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useStore = () => {
  return useContext(StoreContext);
};