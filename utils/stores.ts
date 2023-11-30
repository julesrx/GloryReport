import type {
    DestinyCharacterComponent,
    DestinyHistoricalStatsPeriodGroup,
    DestinyProfileComponent,
    DestinyProfileResponse
} from 'bungie-api-ts/destiny2';

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
        activities.value.length = 0;
        for (const character of characters) {
            loadings.value[character.characterId] = true;
            loadCharacter(character, 0);
        }
    };

    const loadCharacter = async (character: DestinyCharacterComponent, page: number) => {
        const res = await getActivityHistory(
            character.membershipId,
            character.membershipType,
            character.characterId,
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
