import localforage from 'localforage';

import { APP_NAME } from '~/contants';

export const getStore = (storeName: string): LocalForage => {
  return localforage.createInstance({
    name: APP_NAME,
    storeName,
    driver: localforage.INDEXEDDB
  });
};
