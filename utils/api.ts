import type { ServerResponse } from 'bungie-api-ts/common';
import type { GlobalAlert } from 'bungie-api-ts/core';
import type { UserSearchResponse, UserSearchPrefixRequest } from 'bungie-api-ts/user';

const fetchApi = $fetch.create({
    baseURL: 'https://stats.bungie.net/Platform/',
    headers: { 'X-Api-Key': import.meta.env.BUNGIE_API_KEY }
});

export const getGlobalAlerts = async () => {
    return await fetchApi<ServerResponse<GlobalAlert[]>>('GlobalAlerts/');
};

export const searchByGlobalNamePost = async (displayNamePrefix: string) => {
    const body: UserSearchPrefixRequest = { displayNamePrefix };
    return await fetchApi<ServerResponse<UserSearchResponse>>('User/Search/GlobalName/0/', {
        method: 'POST',
        body
    });
};
