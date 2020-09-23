import axios from 'axios';
import PQueue from 'p-queue';

export const bhttp = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': process.env.VUE_APP_BUNGIE_API_KEY }
});

export const bqueue = new PQueue({
  intervalCap: 20,
  interval: 1000
});
