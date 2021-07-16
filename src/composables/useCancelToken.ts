import { onBeforeUnmount } from 'vue';
import axios, { CancelTokenSource } from 'axios';

const useCancelToken = (): CancelTokenSource => {
  const cancelToken = axios.CancelToken.source();
  onBeforeUnmount(() => {
    cancelToken.cancel();
  });

  return cancelToken;
};

export default useCancelToken;
