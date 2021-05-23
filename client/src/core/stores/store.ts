import { createContext, useContext } from 'react';
import ActivityStore from './activityStore';

interface Store {
  activityStore: ActivityStore
}

//a common end of store
export const store: Store = {
  activityStore: new ActivityStore()
};

export const StoreContext = createContext(store);

//a hook to use store
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useStore = () => {
  return useContext(StoreContext);
};