export default <T>(id: string, fn: () => T | Promise<T>, interval = 1000) => {
    const activities = useActivitiesStore();
    const db = useDatabase();
    const controller = useAbortController();

    const { data, pending, refresh } = useLazyAsyncData(id, async () => await fn(), {
        deep: false
    });

    const { pause, resume } = useIntervalFn(() => {
        if (db.getEncounterCount() === activities.activities.length) {
            pause();
            return;
        }

        refresh();
    }, interval);

    useEventListener(controller.signal, 'abort', pause);

    return { data, pending, refresh, pause, resume };
};
