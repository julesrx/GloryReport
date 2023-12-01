import Queue from 'p-queue';

export default defineStore('pgcr', () => {
    const queue = new Queue({ concurrency: 8 });
    const db = useDatabase();
    const cache = useCache();
    const abortcontroller = useAbortController();

    const init = () => {
        queue.clear();
        db.clear();
    };

    const totalFetched = ref(0);

    const expiration = 60 * 60 * 24 * 14; // 14 days
    const fetchReport = (activityId: string) => {
        const t = async () => {
            const cached = await cache.gset(
                `pgcr:${activityId}`,
                async () => await getPostGameCarnageReport(activityId).then(r => r.Response),
                expiration
            );

            db.insertEncounters(cached);
            totalFetched.value++;
        };

        queue.add(() => t(), { signal: abortcontroller.signal });
    };

    return { init, fetchReport, totalFetched };
});
