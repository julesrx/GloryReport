import localforage from "localforage";

import { version } from "../package.json";

const dbName = "Glory.report";
const appVersionKey = "app-version";

export const requestCacheKey = "request-cache";

export function getStorage(storeName: string) {
  const store = localforage.createInstance({
    name: dbName,
    storeName,
  });

  const localVersion = localStorage.getItem(appVersionKey);
  if (localVersion !== version) {
    store.clear();
    localStorage.setItem(appVersionKey, version);
  }

  return store;
}

export const requestCache = getStorage(requestCacheKey);
