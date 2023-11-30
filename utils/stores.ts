import { createCacheStorage } from '@julesrx/utils';
import type {
    DestinyCharacterComponent,
    DestinyHistoricalStatsPeriodGroup,
    DestinyPostGameCarnageReportData,
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

    // const loadings = ref<{ [characterId: string]: boolean }>({});
    // const loadingDone = computed(() =>
    //     Object.keys(loadings.value).every(k => loadings.value[k] === false)
    // );

    const load = (characters: DestinyCharacterComponent[]) => {
        activities.value.length = 0;
        for (const character of characters) {
            // loadings.value[character.characterId] = true;
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
            // loadings.value[character.characterId] = false;
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
    const reports = shallowRef<DestinyPostGameCarnageReportData[]>();

    const init = () => {
        queue.clear();
        reports.value = [];
    };

    const expiration = 60 * 60 * 24 * 14; // 14 days
    const fetchReport = (activityId: string) => {
        const t = async () => {
            const cached = await cache.gset(
                `pgcr:${activityId}`,
                async () => await getPostGameCarnageReport(activityId).then(r => r.Response),
                expiration
            );

            reports.value!.push(cached);
        };

        queue.add(() => t(), { signal: abortcontroller.signal });
    };

    const done = () => queue.size === 0;

    return { reports, init, fetchReport, done };
});
