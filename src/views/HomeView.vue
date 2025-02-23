<script setup lang="ts">
import { useTitle, useIntersectionObserver } from '@vueuse/core'
import { useMovieStore } from '@/stores/useMovieStore'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import MovieCard from '@/components/MovieCard.vue'

const movieStore = useMovieStore()
const pageTitle = useTitle()
const { t } = useI18n()

const bottomElement = ref<HTMLElement | null>(null)

const { isSearching } = storeToRefs(movieStore)

onMounted(() => {
  pageTitle.value = t('HOME.PAGE_TITLE')

  if (isSearching.value) {
    movieStore.fetchMoviesBySearch()
    return
  }

  movieStore.fetchPopularMovies()
})

useIntersectionObserver(bottomElement, ([{ isIntersecting }]) => {
  if (isIntersecting) movieStore.fetchPopularMovies()
})
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold mb-6">
        {{ t('HOME.TITLE_POPULAR_MOVIES') }}
      </h1>

      <div class="flex items-center gap-3">
        <input
          v-model="movieStore.search"
          type="text"
          :placeholder="t('HOME.PLACEHOLDER_SEARCH')"
          class="p-2 border border-gray-300 rounded"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <MovieCard v-for="movie in movieStore.movies" :key="movie.id" :movie="movie" />
    </div>

    <div ref="bottomElement" class="h-10" />

    <div
      v-if="movieStore.isLoading"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6"
    >
      <MovieCard v-for="n in 5" :key="n" :movie="{ isLoading: true }" />
    </div>
  </div>
</template>
