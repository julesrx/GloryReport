import { BungieMembershipType, type ServerResponse } from 'bungie-api-ts/common';
import type { GlobalAlert } from 'bungie-api-ts/core';
import type {
    DestinyActivityHistoryResults,
    DestinyPostGameCarnageReportData,
    DestinyProfileResponse
} from 'bungie-api-ts/destiny2';
import type { UserSearchResponse, UserSearchPrefixRequest } from 'bungie-api-ts/user';

const fetchApi = $fetch.create({
    baseURL: 'https://stats.bungie.net/Platform/',
    headers: { 'X-Api-Key': import.meta.env.VITE_BUNGIE_API_KEY },
    onRequest: ({ request }) => {
        if (!request.toString().endsWith('/')) throw new Error('Aborted');
    }
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

export const getProfile = async (
    destinyMembershipId: string,
    membershipType: BungieMembershipType
) => {
    return await fetchApi<ServerResponse<DestinyProfileResponse>>(
        `Destiny2/${membershipType}/Profile/${destinyMembershipId}/`,
        { params: { components: '100,200' } }
    );
};

export const getActivityHistory = async (
    destinyMembershipId: string,
    membershipType: BungieMembershipType,
    characterId: string,
    abortSignal: AbortSignal,
    page = 0
) => {
    return await fetchApi<ServerResponse<DestinyActivityHistoryResults>>(
        `Destiny2/${membershipType}/Account/${destinyMembershipId}/Character/${characterId}/Stats/Activities/`,
        {
            params: {
                mode: 5, // AllPvP
                count: 250,
                page
            },
            signal: abortSignal
        }
    );
};

export const getPostGameCarnageReport = async (activityId: string) => {
    return await fetchApi<ServerResponse<DestinyPostGameCarnageReportData>>(
        `Destiny2/Stats/PostGameCarnageReport/${activityId}/`
    );
};
