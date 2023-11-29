import type { ServerResponse } from 'bungie-api-ts/common';
import type { GlobalAlert } from 'bungie-api-ts/core';

const fetchApi = $fetch.create({
    baseURL: 'https://stats.bungie.net/Platform/',
    headers: { 'X-Api-Key': import.meta.env.BUNGIE_API_KEY }
});

export const getGlobalAlerts = async () => {
    return await fetchApi<ServerResponse<GlobalAlert[]>>('GlobalAlerts/');
};
