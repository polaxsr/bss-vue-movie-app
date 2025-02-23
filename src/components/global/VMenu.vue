<script lang="ts" setup>
  interface MenuItem {
    label: string,
    command?: void,
  }

  defineProps<{
    items: MenuItem[]
  }>();

  const onClick = (command: void | null | undefined): void => {
    if (!command) return;

    command();
  };
</script>

<template>
  <ul class="flex flex-col gap-1">
    <li
      v-for="(item, index) in items"
      :key="`menu-item-${index}`"
      class="p-2 rounded-sm cursor-pointer hover:bg-gray-100"
      @click="onClick(item?.command)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>
