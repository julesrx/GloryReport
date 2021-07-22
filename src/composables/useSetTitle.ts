import { useTitle } from '@vueuse/core';

import { APP_NAME } from '~/contants';

const useSetTitle = (): ((val?: string) => string) => {
  const title = useTitle(APP_NAME);

  const setTitle = (val = '') => (title.value = val ? val + ' - ' + APP_NAME : APP_NAME);
  return setTitle;
};

export { useSetTitle };
