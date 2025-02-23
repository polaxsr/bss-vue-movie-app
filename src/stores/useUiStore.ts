import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('uiStore', () => {
  const isLoading = ref(false);

  const startLoading = () => (isLoading.value = true);
  const stopLoading = () => (isLoading.value = false);

  return { isLoading, startLoading, stopLoading };
});
