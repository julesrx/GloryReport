import type {
    DestinyCharacterComponent,
    DestinyProfileComponent,
    DestinyProfileResponse
} from 'bungie-api-ts/destiny2';
import type { UserInfoCard } from 'bungie-api-ts/user';
import { EncounterStanding } from '~/utils/types';

const locale = 'en-US';
export const dateTimeShortFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short'
});

export const getUserDisplayName = (userInfo: UserInfoCard): string | null => {
    let displayName = userInfo.displayName;
    if (userInfo.bungieGlobalDisplayName && userInfo.bungieGlobalDisplayNameCode) {
        const code = (userInfo.bungieGlobalDisplayNameCode ?? '').toString().padStart(4, '0');
        displayName = `${userInfo.bungieGlobalDisplayName}#${code}`;
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

export const getEncounterStanding = (sameTeam: boolean, isVictory: boolean) => {
    if (sameTeam) {
        return isVictory ? EncounterStanding.VictorySameTeam : EncounterStanding.DefeatSameTeam;
    } else {
        return isVictory ? EncounterStanding.Victory : EncounterStanding.Defeat;
    }
};

export const extractProfileResponseData = (
    response: DestinyProfileResponse
): [DestinyProfileComponent, DestinyCharacterComponent[]] => {
    const profile = response.profile.data!;
    const characters = (() => {
        const chars = response.characters.data;
        return !chars ? [] : Object.keys(chars).map(k => chars[k]);
    })();

    return [profile, characters];
};
