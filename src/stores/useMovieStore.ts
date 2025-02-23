import { ref, computed, watch, onMounted } from 'vue';
import { defineStore } from 'pinia';
import { useRoute } from 'vue-router';
import { debounce } from 'lodash';
import axios from 'axios';
import router from '@/router';

/** Api key have to be stored at .env file on BE side.
 * This is just a simple example to show how to work with server data. */
const API_KEY = '090df05cee917c2d9756e9477ecb09a5';
const BASE_URL = 'https://api.themoviedb.org/3';

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  release_date: string;
  overview?: string;
  poster_path?: string;
}

export const useMovieStore = defineStore('movieStore', () => {
  const route = useRoute();

  const isLoading = ref(false);
  const page = ref(1);
  const movies = ref<Movie[]>([]);
  const search = ref(route.query.search || '');
  const movieDetails = ref<Movie | null>(null);

  const isSearching = computed(() => search.value.length > 0);

  const currentLang = computed(() => route.params.lang as 'cs' | 'en');

  const apiLang = computed(() => (currentLang.value === 'cs' ? 'cs-CZ' : 'en-US'));

  const fetchPopularMovies = async (): Promise<void> => {
    if (isLoading.value || isSearching.value) return;
    isLoading.value = true;

    try {
      const response = await axios.get(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${apiLang.value}&page=${page.value}`
      );
      movies.value.push(...response.data.results);
      page.value++;
    } catch (error) {
      console.error('Error while loading movies:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMoviesBySearch = async (): Promise<void> => {
    if (isLoading.value) return;

    isLoading.value = true;
    movies.value = [];

    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=${apiLang.value}&query=${search.value}`
      );
      movies.value = response.data.results;
    } catch (error) {
      console.error('Error while loading movies:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMovieDetails = async (id: number): Promise<void> => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${apiLang.value}`);
      movieDetails.value = response.data;
    } catch (error) {
      console.error('Error while loading movie details:', error);
    }
  };

  const debouncedFetchMovies = debounce(fetchMoviesBySearch, 500);

  watch(currentLang, () => {
    if (isSearching.value) {
      fetchMoviesBySearch();
    } else {
      fetchPopularMovies();
    }
  });

  watch(search, () => {
    router.replace({
      query: {
        search: search.value || undefined,
      },
    });

    if (isSearching.value) {
      debouncedFetchMovies();
      return;
    }

    fetchPopularMovies();
  });

  watch(() => route.query, (newQuery) => {
    if (newQuery.search !== search.value) {
      search.value = newQuery.search || ''
    }
  }, { immediate: true });

  return {
    isLoading,
    isSearching,
    movies,
    movieDetails,
    search,
    fetchPopularMovies,
    fetchMoviesBySearch,
    fetchMovieDetails
  };
});
