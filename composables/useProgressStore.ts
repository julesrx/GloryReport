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
                const prog = Math.trunc((fetchedCount / acts.activityCount) * 100);
                set(prog === 100 && acts.loadings.length > 0 ? 90 : prog);
            },
            { throttle: 500, immediate: true }
        );

        onUnmounted(() => set(0));
    };

    return { progress, set, watch };
});
