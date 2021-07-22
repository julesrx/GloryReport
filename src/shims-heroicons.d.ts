/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '@heroicons/vue/*' {
  const content: any;
  export default content;
}

declare module '@heroicons/vue/solid' {
  export { default as XIcon } from '@heroicons/vue/solid/esm/XIcon.js';
  export { default as ExternalLinkIcon } from '@heroicons/vue/solid/esm/ExternalLinkIcon.js';
}
