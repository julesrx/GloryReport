import axios, { CancelToken } from 'axios';
import { ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyActivityHistoryResults,
  DestinyActivityModeType,
  DestinyCharacterComponent,
  DestinyHistoricalStatsPeriodGroup,
  DestinyPostGameCarnageReportData
} from 'bungie-api-ts/destiny2';

import { getStore } from '~/storage';

const api = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': import.meta.env.VITE_BUNGIE_API_KEY }
});

const pgcrs = getStore('d2-pgcr-datas');

// TODO: use p-queue ?
const getPGCR = async (
  instanceId: string,
  cancelToken: CancelToken
): Promise<DestinyPostGameCarnageReportData> => {
  const uri = `Destiny2/Stats/PostGameCarnageReport/${instanceId}/`;

  const cache = await pgcrs.getItem<DestinyPostGameCarnageReportData>(uri);
  if (cache) return cache;

  const res = await api.get<ServerResponse<DestinyPostGameCarnageReportData>>(uri, { cancelToken });
  await pgcrs.setItem(uri, res.data.Response);

  return res.data.Response;
};

const getActivities = async (
  character: DestinyCharacterComponent,
  page = 0,
  cancelToken: CancelToken
): Promise<DestinyHistoricalStatsPeriodGroup[]> => {
  const mode = DestinyActivityModeType.AllPvP;
  const count = 250;

  const res = await api.get<ServerResponse<DestinyActivityHistoryResults>>(
    `Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
    {
      params: { count: count, mode: mode, page: page },
      cancelToken
    }
  );

  if (!res.data.Response.activities) return [];

  return res.data.Response.activities;
};

export default api;
export { getPGCR, getActivities };
