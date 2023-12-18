import PQueue from 'p-queue';

export default defineStore('pgcr', () => {
    const db = useDatabase();
    const cache = useCache();
    const abortcontroller = useAbortController();

    const queue = new PQueue({ concurrency: 8 });

    const idle = ref(false);
    queue.on('idle', () => (idle.value = true));

    const clear = () => {
        fetchedCount.value = 0;
        queue.clear();
        db.clear();
    };

    const fetchedCount = ref(0);

    const fetchReport = (activityId: string) => {
        const t = async () => {
            fetchedCount.value++;

            const cached = await getCachedPostGameCarnageReport(activityId, cache);
            db.insertEncounters(cached);
        };

        queue.add(() => t(), { signal: abortcontroller.signal });
        idle.value = false;
    };

    return { clear, fetchReport, fetchedCount: readonly(fetchedCount), idle: readonly(idle) };
});
