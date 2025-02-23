<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieStore } from '@/stores/useMovieStore'
import { useTitle } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import VBtn from '@/components/global/VBtn.vue'

const route = useRoute()
const pageTitle = useTitle()
const movieStore = useMovieStore()
const { t } = useI18n()

watch(
  () => movieStore.movieDetails,
  (movie) => {
    if (!movie) return
    pageTitle.value = t('DETAILS.PAGE_TITLE', [movie.title])
  },
  { immediate: true },
)

onMounted(() => {
  const movieId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  movieStore.fetchMovieDetails(parseInt(movieId));
})
</script>

<template>
  <div v-if="movieStore.movieDetails" class="py-5">
    <VBtn to="/" class="mb-3"> Back </VBtn>

    <div class="flex gap-5">
      <img
        :src="'https://image.tmdb.org/t/p/w500' + movieStore.movieDetails.poster_path"
        alt="Постер"
        class="mx-auto rounded-lg"
      />

      <div>
        <h1 class="text-3xl font-bold mt-4">{{ movieStore.movieDetails.title }}</h1>

        <p class="mt-2 text-gray-600">{{ movieStore.movieDetails.overview }}</p>

        <p class="mt-2">
          <strong>
            {{ t('DETAILS.TEXT_RATING') }}
          </strong>

          {{ movieStore.movieDetails.vote_average }}
        </p>

        <p class="mt-2">
          <strong>
            {{ t('DETAILS.TEXT_RELEASE_DATE') }}
          </strong>

          {{ movieStore.movieDetails.release_date }}
        </p>
      </div>
    </div>
  </div>
</template>
