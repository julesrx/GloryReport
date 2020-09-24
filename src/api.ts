import axios from 'axios';
import PQueue from 'p-queue';

import { requestCache } from '@/storage';
import { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2/interfaces';

const getPGCRrequestUrl = (instanceId: string): string => {
  return `Destiny2/Stats/PostGameCarnageReport/${instanceId}/`;
};

export const bhttp = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': process.env.VUE_APP_BUNGIE_API_KEY }
});

export const bqueue = new PQueue({
  intervalCap: 20,
  interval: 1000
});

export function getCachedPGCR(instanceId: string): Promise<DestinyPostGameCarnageReportData> {
  return requestCache.getItem(getPGCRrequestUrl(instanceId)) as Promise<
    DestinyPostGameCarnageReportData
  >;
}

export const getPGCR = (instanceId: string, callback: any) => {
  getCachedPGCR(instanceId).then(res => {
    if (res) return callback(res);
    else {
      const requestUrl = getPGCRrequestUrl(instanceId);

      return bqueue.add(() =>
        bhttp
          .get(requestUrl)
          .then(res => res.data.Response)
          .then(res => {
            requestCache.setItem(requestUrl, res);
            callback(res);
          })
      );
    }
  });
};
