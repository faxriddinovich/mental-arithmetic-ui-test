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
    <div class="columns is-mobile is-multiline mt-2">
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card image="https://amakids.com/images/pages/ma/goals-block.png" />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card image="https://marvelkidsflorida.com/wp-content/uploads/2019/05/Mental-caclulation-1279x959.jpg" />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card image="https://kidgeniuschicago.com/wp-content/uploads/2019/06/mathematic-calculate-kids-.jpg" />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card image="https://thumbs.dreamstime.com/b/special-abacus-mental-math-kid-hand-183329008.jpg" />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card image="https://img.freepik.com/free-photo/mental-arithmetic-mathematics-concept-colorful-pens-pencils-numbers-abacus-scores_120794-673.jpg?size=626&ext=jpg" />
      </div>
    </div>
    <div class="my-2">
      <b-button type="is-primary" icon-left="arrow-down" expanded>Load more</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MainTopNavbar from "@/components/main-top-navbar.vue";
import MainGameBar from "@/components/main-game-bar.vue";
import MainSearchBar from "@/components/main-search-bar.vue";
import CourseCard from "@/components/course/card.vue";

@Component({
  components: { MainTopNavbar, MainGameBar, MainSearchBar, CourseCard },
})
export default class Home extends Vue {}
</script>
