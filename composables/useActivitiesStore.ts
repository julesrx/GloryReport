import type {
    DestinyCharacterComponent,
    DestinyHistoricalStatsPeriodGroup
} from 'bungie-api-ts/destiny2';

export default defineStore('activities', () => {
    const reports = useReportStore();
    const abortcontroller = useAbortController();

    const activities = ref<DestinyHistoricalStatsPeriodGroup[]>([]);

    const loadings = ref<string[]>([]);
    const removeLoading = (characterId: string) => {
        loadings.value = loadings.value.filter(i => i !== characterId);
    };

    const load = (characters: DestinyCharacterComponent[]) => {
        activities.value.length = 0;

        loadings.value.push(...characters.map(c => c.characterId));
        for (const character of characters) {
            loadCharacter(character, 0);
        }
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
            removeLoading(character.characterId);
            return;
        }

        for (const act of acts) {
            reports.fetchReport(act.activityDetails.instanceId);
        }

        activities.value.push(...acts);
        loadCharacter(character, page + 1);
    };

    return { load, activities, loadings };
});
