import { createContext, useContext } from 'react';
import ActivityStore from './activityStore';
import AppStore from './AppStore';
import ModalStore from './ModalStore';
import UserStore from './UserStore';

interface Store {
  activityStore: ActivityStore,
  userStore: UserStore,
  appStore: AppStore,
  modalStore: ModalStore
}

//a common end of store
export const store: Store = {
  activityStore: new ActivityStore(),
  userStore: new UserStore(),
  appStore: new AppStore(),
  modalStore: new ModalStore()
};

export const StoreContext = createContext(store);

//a hook to use store
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useStore = () => {
  return useContext(StoreContext);
};