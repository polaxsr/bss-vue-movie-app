<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { useMovieStore } from '@/stores/useMovieStore';
  import { useI18n } from 'vue-i18n';

  import VPopover from '@/components/global/VPopover.vue';
  import VMenu from '@/components/global/VMenu.vue';
  import VBtn from '@/components/global/VBtn.vue';

  const languagesMenu: { [k: string]: any } = [
    {
      label: '🇨🇿 Čeština',
      command: () => changeLanguage('cs')
    },
    {
      label: '🇬🇧 English',
      command: () => changeLanguage('en')
    }
  ];

  const movieStore = useMovieStore();
  const router = useRouter();
  const { locale, t } = useI18n();

  /** Simple example of locale switch, better to do this using store,
   * if we want to change language from different places.
   * Since we have only 1 place where user can change locale, we can leave logic here */
  const changeLanguage = (lang): void => {
    locale.value = lang;
    router.push(`/${lang}/`);
    localStorage.setItem('lang', lang);
    movieStore.fetchPopularMovies();
  };
</script>

<template>
  <VPopover hover right>
    <template #activator="{ on }">
      <VBtn v-on="on">
        {{ t('LANGUAGE_MENU.BTN_LANGUAGE') }}
      </VBtn>
    </template>

    <VMenu :items="languagesMenu" />
  </VPopover>
</template>
