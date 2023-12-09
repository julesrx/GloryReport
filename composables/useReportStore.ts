import Queue from 'p-queue';

export default defineStore('pgcr', () => {
    const db = useDatabase();
    const cache = useCache();
    const abortcontroller = useAbortController();

    const queue = new Queue({ concurrency: 8 });

    const clear = () => {
        fetchedCount.value = 0;
        queue.clear();
        db.clear();
    };

    const fetchedCount = ref(0);

    const fetchReport = (activityId: string) => {
        const t = async () => {
            const cached = await getCachedPostGameCarnageReport(activityId, cache);

            db.insertEncounters(cached);
            fetchedCount.value++;
        };

        queue.add(() => t(), { signal: abortcontroller.signal });
    };

    return { clear, fetchReport, fetchedCount: readonly(fetchedCount) };
});
