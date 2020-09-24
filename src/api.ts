import axios, { CancelToken } from 'axios';
import PQueue from 'p-queue';

import { requestCache } from '@/storage';
import { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2/interfaces';

export const bhttp = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': process.env.VUE_APP_BUNGIE_API_KEY }
});

export const bqueue = new PQueue({
  intervalCap: 20,
  interval: 1000
});

function getPGCRrequestUrl(instanceId: string): string {
  return `Destiny2/Stats/PostGameCarnageReport/${instanceId}/`;
}

function getCachedRequest<T>(url: string): Promise<T | null> {
  return requestCache.getItem(url);
}

export function getCachedPGCR(
  instanceId: string
): Promise<DestinyPostGameCarnageReportData | null> {
  return getCachedRequest<DestinyPostGameCarnageReportData>(getPGCRrequestUrl(instanceId));
}

export function getPGCR(
  instanceId: string,
  callback: (pgcr: DestinyPostGameCarnageReportData) => void,
  cancelToken?: CancelToken
) {
  getCachedPGCR(instanceId).then(res => {
    if (res) return callback(res);
    else {
      const requestUrl = getPGCRrequestUrl(instanceId);

      return bqueue.add(() =>
        bhttp
          .get(requestUrl, { cancelToken: cancelToken })
          .then(res => res.data.Response)
          .then(res => {
            requestCache.setItem(requestUrl, res);
            callback(res);
          })
      );
    }
  });
}
