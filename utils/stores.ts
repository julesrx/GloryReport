import { createCacheStorage } from '@julesrx/utils';
import type {
    DestinyCharacterComponent,
    DestinyHistoricalStatsPeriodGroup,
    DestinyPostGameCarnageReportData,
    DestinyProfileComponent,
    DestinyProfileResponse
} from 'bungie-api-ts/destiny2';

let abortcontroller: AbortController;

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
    const activities = ref<DestinyHistoricalStatsPeriodGroup[]>([]);

    const loadings = ref<{ [characterId: string]: boolean }>({});
    const loadingDone = computed(() =>
        Object.keys(loadings.value).every(k => loadings.value[k] === false)
    );

    const load = (characters: DestinyCharacterComponent[]) => {
        abortcontroller = new AbortController();
        activities.value.length = 0;
        for (const character of characters) {
            loadings.value[character.characterId] = true;
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
            loadings.value[character.characterId] = false;
            return;
        }

        activities.value.push(...acts);
        loadCharacter(character, page + 1);
    };

    return { load, activities, loadings, loadingDone };
});

const cache = createCacheStorage();
export const usePgcrStore = defineStore('pgcr', () => {
    const reports = shallowRef<DestinyPostGameCarnageReportData[]>();

    const init = () => {
        reports.value = [];
    };

    const expiration = 60 * 60 * 24 * 14; // 14 days
    const fetchReport = async (activityId: string) => {
        const cached = await cache.gset(
            `pgcr:${activityId}`,
            async () =>
                await getPostGameCarnageReport(activityId, abortcontroller.signal).then(
                    r => r.Response
                ),
            expiration
        );

        reports.value!.push(cached);
        return cached;
    };

    return { reports, init, fetchReport };
});
