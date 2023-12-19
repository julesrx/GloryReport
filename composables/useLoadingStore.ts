export default defineStore('loading', () => {
    const acts = useActivitiesStore();
    const reports = useReportStore();

    const loading = ref(false);
    watchThrottled(
        () => [acts.done, reports.idle],
        ([done, idle]) => {
            loading.value = !done || !idle;
        },
        { throttle: 500, immediate: true }
    );

    return { loading: readonly(loading) };
});
