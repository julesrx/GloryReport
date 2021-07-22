import localforage from 'localforage';

import { APP_NAME } from '~/contants';

const getStore = (storeName: string, version: string | null = null): LocalForage => {
  const store = localforage.createInstance({
    name: APP_NAME,
    storeName,
    driver: localforage.INDEXEDDB
  });

  if (version) {
    const currentVersion = getStoreVersion(storeName);
    if (currentVersion && currentVersion !== version) store.clear(); // do not wait for this

    setStoreVersion(storeName, version);
  }

  return store;
};

const getStoreVersion = (storeName: string): string | null =>
  localStorage.getItem(`${storeName}-version`);
const setStoreVersion = (storeName: string, version: string): void =>
  localStorage.setItem(`${storeName}-version`, version);

export { getStore };
