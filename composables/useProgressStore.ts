export default defineStore('progress', () => {
    const db = useDatabase();
    const acts = useActivitiesStore();

    const progress = ref(0);
    const set = (number: number) => {
        progress.value = number;
    };

    const watch = () => {
        useIntervalFn(() => {
            const count = db.getEncounterCount();
            const prog = Math.trunc((count / acts.activityCount) * 100);

            console.log(count, acts.activityCount, prog);

            set(prog === 100 && acts.loadings.length > 0 ? 90 : prog);
        }, 1000);

        onUnmounted(() => set(0));
    };

    return { progress, set, watch };
});
