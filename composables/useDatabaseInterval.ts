export default (fn: () => void, interval = 1000) => {
    const reports = useReportStore();
    const activities = useActivitiesStore();

    const { pause } = useIntervalFn(fn, interval, { immediate: true });

    whenever(
        () => reports.totalFetched === activities.activities?.length,
        () => pause()
    );
};
