import axios, { CancelToken } from 'axios';
import PQueue from 'p-queue';

const api = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': import.meta.env.VITE_BUNGIE_API_KEY }
});

export default api;

// export const getPGCR = async (instanceId) => {
//   const uri = `Destiny2/Stats/PostGameCarnageReport/${instanceId}/`;

//   const cache = localStorage.getItem(uri);
//   if (cache) return JSON.parse(cache);

//   const res = await api.get(uri);
//   localStorage.setItem(uri, JSON.stringify(res.data.Response));

//   return res.data.Response;
// };
