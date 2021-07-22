import { onBeforeUnmount } from 'vue';

const useAbortSignal = (): AbortSignal => {
  const controller = new AbortController();

  onBeforeUnmount(() => {
    controller.abort();
  });

  return controller.signal;
};

export default useAbortSignal;
