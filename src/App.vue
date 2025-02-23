<script setup>
  import VLoader from '@/components/global/VLoader.vue';
  import LanguageMenu from '@/components/LanguageMenu.vue';

  import { useUiStore } from '@/stores/useUiStore.js';
  import { onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';

  const uiStore = useUiStore();
  const route = useRoute();

  onMounted(() => {
    watch(
      () => route.path,
      async () => {
        uiStore.startLoading();

        // Fake loading effect to show loader
        await new Promise((resolve) => setTimeout(resolve, 500));

        uiStore.stopLoading();
      },
      { immediate: true }
    );
  });
</script>

<template>
  <div class="container mx-auto">
    <transition name="fade-loader">
      <VLoader v-if="uiStore.isLoading" />
    </transition>

    <header class="flex items-center justify-between w-full py-4 border-b border-gray-200">
      <router-link to="/">
        <img
          class="w-40"
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
          alt="TMDB"
        />
      </router-link>

      <LanguageMenu />
    </header>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>


<style lang="scss" scoped>
  .fade {
    &-enter-active, &-leave-active {
      transition: opacity 0.5s;
    }

    &-loader-enter-active, &-loader-leave-active {
      transition: opacity 0.3s ease-in-out;
    }

    &-enter, &-leave-to,
    &-loader-enter, &-loader-leave-to {
      opacity: 0;
    }
  }
</style>
