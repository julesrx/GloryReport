export default <T>(id: string, handler: () => T | Promise<T>, throttle = 1000) => {
    const reports = useReportStore();
    const controller = useAbortController();

    const { data, pending, refresh } = useLazyAsyncData(id, async () => await handler(), {
        deep: false
    });

    const unwatch = watchThrottled(
        () => reports.fetchedCount,
        () => refresh(),
        {
            throttle,
            immediate: true
        }
    );

    useEventListener(controller.signal, 'abort', unwatch);

    return { data, pending, refresh };
};
