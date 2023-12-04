export default defineStore('progress', () => {
    const reports = useReportStore();
    const acts = useActivitiesStore();

    const progress = ref(0);
    const set = (number: number) => {
        progress.value = number;
    };

    const watch = () => {
        watchThrottled(
            () => reports.fetchedCount,
            fetchedCount => {
                if (acts.done && fetchedCount === acts.activityCount) return set(100);

                const prog = Math.trunc((fetchedCount / acts.activityCount) * 100);
                if (prog === 100 && !acts.done) return set(99);

                set(prog);
            },
            { throttle: 500, immediate: true }
        );

        onUnmounted(() => set(0));
    };

    return { progress, set, watch };
});
