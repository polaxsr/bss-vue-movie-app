<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  const { locale } = useI18n();

  interface Movie {
    id?: number;
    title?: string;
    vote_average?: number;
    poster_path?: string;
    isLoading?: boolean;
  }

  defineProps<{ movie: Movie }>();
</script>

<template>
  <router-link :to="`/${locale}/details/${movie.id}`"
    class="
      bg-gray-800
      text-white
      rounded-lg
      overflow-hidden
      cursor-pointer
      transform
      transition
      duration-300
      hover:scale-105
    "
  >
    <div v-if="movie.isLoading" class="w-full h-80 bg-gray-700 animate-pulse"></div>

    <img
      v-else-if="movie.poster_path"
      :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
      :alt="movie.title"
      class="w-full h-80 object-cover"
    />

    <div class="p-4 text-center">
      <h2 class="text-lg font-bold">{{ movie.title }}</h2>

      <p class="text-yellow-400 text-sm mt-2">⭐ {{ movie.vote_average }}</p>
    </div>
  </router-link>
</template>
