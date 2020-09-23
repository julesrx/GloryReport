import localforage from 'localforage';

const dbName = 'Glory.report';
const appVersionKey = 'app-version';

export const requestCacheKey = 'request-cache';

export function getStorage(storeName) {
  const version = process.env.VUE_APP_VERSION;
  const store = localforage.createInstance({
    name: dbName,
    storeName
  });

  const localVersion = localStorage.getItem(appVersionKey);
  if (localVersion !== version) {
    store.clear();
    localStorage.setItem(appVersionKey, version);
  }

  return store;
}

export const requestCache = getStorage(requestCacheKey);
