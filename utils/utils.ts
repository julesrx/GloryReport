import type { UserInfoCard } from 'bungie-api-ts/user';

const locale = 'en-US';
export const dateTimeShortFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short'
});

export const getUserDisplayName = (userInfo: UserInfoCard): string | null => {
    let displayName = userInfo.displayName;
    if (userInfo.bungieGlobalDisplayName && userInfo.bungieGlobalDisplayNameCode) {
        displayName = `${userInfo.bungieGlobalDisplayName}#${userInfo.bungieGlobalDisplayNameCode}`;
    }

    return displayName ?? null;
};

export const splitDisplayName = (displayName: string | null): [string, string] => {
    if (!displayName) return ['Anonymous', ''];
    if (!displayName.includes('#')) return [displayName, ''];

    const split = displayName.split('#');
    return [split[0], split[1]];
};

export const getMembershipTypeId = (userInfo: UserInfoCard) => {
    return `${userInfo.membershipType}-${userInfo.membershipId}`;
};

export const splitMembershipTypeId = (membershipTypeId: string): [number, string] => {
    const split = membershipTypeId.split('-');
    const membershipType = +split[0];
    const membershipId = split[1];

    return [membershipType, membershipId];
};
