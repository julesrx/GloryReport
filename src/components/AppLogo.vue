<template>
  <div class="flex justify-center">
    <component
      :is="useLink ? 'router-link' : 'div'"
      :to="useLink ? '/' : undefined"
      class="flex justify-center items-end flex-wrap select-none"
    >
      <img src="/src/assets/logo.png" :alt="appName" :class="[small ? 'h-16 w-16' : 'h-24 w-24']" />
      <h1 :class="[small ? 'text-2xl' : 'text-3xl']">
        <span :class="['font-semibold', small ? 'text-4xl' : 'text-5xl']">{{
          appNameSlitted[0]
        }}</span
        >.{{ appNameSlitted[1] }}
      </h1>
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { APP_NAME } from '~/contants';

export default defineComponent({
  props: {
    small: { type: Boolean, default: false },
    useLink: { type: Boolean, default: false }
  },
  setup() {
    return { appName: APP_NAME, appNameSlitted: APP_NAME.split('.') };
  }
});
</script>
