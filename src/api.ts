import axios from 'axios';
import { ServerResponse } from 'bungie-api-ts/common';
import { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2';

import { getStore } from '~/storage';

const api = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': import.meta.env.VITE_BUNGIE_API_KEY }
});

const pgcrs = getStore('d2-pgcr-datas');

const getPGCR = async (instanceId: string): Promise<DestinyPostGameCarnageReportData> => {
  const uri = `Destiny2/Stats/PostGameCarnageReport/${instanceId}/`;

  const cache = await pgcrs.getItem<DestinyPostGameCarnageReportData>(uri);
  if (cache) return cache;

  const res = await api.get<ServerResponse<DestinyPostGameCarnageReportData>>(uri);
  await pgcrs.setItem(uri, res.data.Response);

  return res.data.Response;
};

export default api;
export { getPGCR };

// export const getPGCR = async (instanceId) => {
//   const uri = `Destiny2/Stats/PostGameCarnageReport/${instanceId}/`;

//   const cache = localStorage.getItem(uri);
//   if (cache) return JSON.parse(cache);

//   const res = await api.get(uri);
//   localStorage.setItem(uri, JSON.stringify(res.data.Response));

//   return res.data.Response;
// };
