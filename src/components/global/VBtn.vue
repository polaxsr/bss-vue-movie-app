<!--This component can be extended to accept props for changing behaviour and color scheme-->
<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps<{
    to?: string
  }>();

  const el = computed(() => {
    if (props.to) {
      return 'router-link';
    }

    return 'button'
  });
</script>

<template>
  <component :is="el" :to="to" class="w-max block px-4 py-2 mx-2 bg-blue-500 rounded text-white">
    <slot />
  </component>
</template>
