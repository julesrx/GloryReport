import axios from 'axios-lab';
import { ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyActivityHistoryResults,
  DestinyActivityModeType,
  DestinyCharacterComponent,
  DestinyHistoricalStatsPeriodGroup,
  DestinyPostGameCarnageReportData
} from 'bungie-api-ts/destiny2';
import PQueue from 'p-queue';

import { getStore } from '~/storage';

const api = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': import.meta.env.VITE_BUNGIE_API_KEY },
  maxRedirects: 0
});

const queue = new PQueue({ interval: 2500, intervalCap: 20 });

const pgcrs = getStore('d2-pgcr-datas');

const getActivities = async (
  character: DestinyCharacterComponent,
  page = 0,
  abortSignal: AbortSignal
): Promise<DestinyHistoricalStatsPeriodGroup[]> => {
  const mode = DestinyActivityModeType.AllPvP;
  const count = 250;

  const res = await api.get<ServerResponse<DestinyActivityHistoryResults>>(
    `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
    {
      params: { count: count, mode: mode, page: page },
      signal: abortSignal
    }
  );

  if (!res.data.Response.activities) return [];

  return res.data.Response.activities;
};

const getPGCR = (
  instanceId: string,
  abortSignal: AbortSignal
): Promise<DestinyPostGameCarnageReportData> => {
  const uri = `Destiny2/Stats/PostGameCarnageReport/${instanceId}/`;

  return new Promise<DestinyPostGameCarnageReportData>(resolve => {
    pgcrs.getItem<DestinyPostGameCarnageReportData>(uri).then(cache => {
      if (cache) resolve(cache);
      else {
        const callback = async () => {
          // using a single cancel token causes memory leak
          // https://github.com/axios/axios/pull/3305
          const res = await api.get<ServerResponse<DestinyPostGameCarnageReportData>>(uri, {
            signal: abortSignal
          });

          const pgcr = await pgcrs.setItem(uri, res.data.Response);
          resolve(pgcr);
        };

        queue.add(() => callback());
      }
    });
  });
};

export default api;
export { getActivities, getPGCR };
