<template>
  <div class="container is-max-widescreen pt-4 px-3">
    <main-top-navbar />
    <div class="mt-3">
      <b-notification type="is-success" aria-close-label="Close notification">
        🎉 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id
        fermentum quam. Proin sagitti
      </b-notification>
    </div>
    <main-game-bar class="mt-1" />
    <main-search-bar />
    <div class="columns is-multiline mt-2">
      <div class="column is-4-desktop">
        <course-card />
      </div>
      <div class="column is-4-desktop">
        <course-card />
      </div>
      <div class="column is-4-desktop">
        <course-card />
      </div>
      <div class="column is-4-desktop">
        <course-card />
      </div>
      <div class="column is-4-desktop">
        <course-card />
      </div>
      <div class="column is-4-desktop">
        <course-card />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MainTopNavbar from "@/components/main-top-navbar.vue";
import MainGameBar from "@/components/main-game-bar.vue";
import MainSearchBar from '@/components/main-search-bar.vue';
import CourseCard from '@/components/course/card.vue';

@Component({ components: { MainTopNavbar, MainGameBar, MainSearchBar, CourseCard } })
export default class Home extends Vue {}
</script>
