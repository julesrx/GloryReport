// Use https://vuejs.org/v2/guide/typescript.html#Augmenting-Types-for-Use-with-Plugins when its fixed with vetur
import axios, { AxiosInstance } from 'axios';

export const Http: AxiosInstance = axios.create();
export const BungieHttp: AxiosInstance = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': process.env.VUE_APP_BUNGIE_API_KEY }
});
