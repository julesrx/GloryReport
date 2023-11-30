import { createCacheStorage } from '@julesrx/utils';
import type {
    DestinyCharacterComponent,
    DestinyHistoricalStatsPeriodGroup,
    DestinyProfileComponent,
    DestinyProfileResponse
} from 'bungie-api-ts/destiny2';
import Queue from 'p-queue';

const abortcontroller = new AbortController();

export const useProfileStore = defineStore('profile', () => {
    const profile = ref<DestinyProfileComponent>();
    const characters = ref<DestinyCharacterComponent[]>([]);

    const init = (response: DestinyProfileResponse) => {
        profile.value = response.profile.data;
        characters.value = (() => {
            const chars = response.characters.data;
            return !chars ? [] : Object.keys(chars).map(k => chars[k]);
        })();
    };

    return { profile, characters, init };
});

export const useActivitiesStore = defineStore('activities', () => {
    const reports = usePgcrStore();
    const activities = ref<DestinyHistoricalStatsPeriodGroup[]>([]);

    const load = (characters: DestinyCharacterComponent[]) => {
        activities.value.length = 0;
        for (const character of characters) {
            loadCharacter(character, 0);
        }

        return abortcontroller;
    };

    const loadCharacter = async (character: DestinyCharacterComponent, page: number) => {
        const res = await getActivityHistory(
            character.membershipId,
            character.membershipType,
            character.characterId,
            abortcontroller.signal,
            page
        );

        const acts = res.Response.activities;
        if (!acts?.length) {
            return;
        }

        for (const act of acts) {
            reports.fetchReport(act.activityDetails.instanceId);
        }

        activities.value.push(...acts);
        loadCharacter(character, page + 1);
    };

    return { load, activities };
});

const cache = createCacheStorage();
export const usePgcrStore = defineStore('pgcr', () => {
    const queue = new Queue({ concurrency: 5 });
    const encounters = new Map<string, { instanceId: string; period: string }[]>();
    const players = new Map<string, string>();

    const init = () => {
        queue.clear();
        players.clear();
        encounters.clear();
    };

    const expiration = 60 * 60 * 24 * 14; // 14 days
    const fetchReport = (activityId: string) => {
        const t = async () => {
            const cached = await cache.gset(
                `pgcr:${activityId}`,
                async () => await getPostGameCarnageReport(activityId).then(r => r.Response),
                expiration
            );

            for (const entry of cached.entries) {
                const membershipId = entry.player.destinyUserInfo.membershipId;
                const infos = entry.player.destinyUserInfo;

                if (infos.bungieGlobalDisplayName && infos.bungieGlobalDisplayNameCode) {
                    const name = `${infos.bungieGlobalDisplayName}#${infos.bungieGlobalDisplayNameCode}`;
                    if (!players.has(membershipId)) players.set(membershipId, name);
                }

                if (!encounters.has(membershipId)) encounters.set(membershipId, []);

                // TODO: read array length and add to a separate array for top 100
                encounters.get(membershipId)!.push({
                    instanceId: cached.activityDetails.instanceId,
                    period: cached.period
                });
            }
        };

        queue.add(() => t(), { signal: abortcontroller.signal });
    };

    const done = () => queue.size === 0;

    return { encounters, players, init, fetchReport, done };
});
