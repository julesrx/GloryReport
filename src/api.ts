import axios, { CancelToken } from 'axios';
import PQueue from 'p-queue';

import { requestCache } from '@/storage';
import { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2/interfaces';

export const bhttp = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': import.meta.env.VITE_BUNGIE_API_KEY }
});

export const bqueue = new PQueue({
  intervalCap: 20,
  interval: 2500
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
  cancelToken?: CancelToken
): Promise<DestinyPostGameCarnageReportData> {
  return new Promise<DestinyPostGameCarnageReportData>((resolve, reject) => {
    getCachedPGCR(instanceId).then((res) => {
      if (res) resolve(res);
      else {
        const url = getPGCRrequestUrl(instanceId);

        bqueue.add(() =>
          bhttp
            .get(url, { cancelToken: cancelToken })
            .then((res) => res.data.Response)
            .then((res) => {
              requestCache.setItem(url, res);
              resolve(res);
            })
            .catch((thrown) => {
              if (axios.isCancel(thrown)) {
                console.log('pgcr canceled', thrown.message);
              } else {
                console.error(thrown);
              }
              reject(thrown);
            })
        );
      }
    });
  });
}
