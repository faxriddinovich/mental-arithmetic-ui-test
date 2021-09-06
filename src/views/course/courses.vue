<template>
  <div>
    <div class="is-flex card p-3">
      <b-dropdown
        v-model="filter"
        :mobile-modal="false"
        multiple
        aria-role="list"
      >
        <template #trigger>
          <b-button icon-left="filter">Filter</b-button>
        </template>

        <b-dropdown-item value="option1" aria-role="listitem">
          <span>Only free courses</span>
        </b-dropdown-item>

        <b-dropdown-item value="option2" aria-role="listitem">
          <span>Last added</span>
        </b-dropdown-item>

        <b-dropdown-item value="option3" aria-role="listitem">
          <span>Popular</span>
        </b-dropdown-item>
      </b-dropdown>
      <b-input
        class="is-flex-grow-1 ml-3"
        placeholder="Course name, author name"
        icon="search"
      >
      </b-input>
      <b-button type="is-primary" class="ml-3" icon-left="search"
        >Search</b-button
      >
    </div>
    <div class="columns is-mobile is-multiline mt-2">
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card
          image="https://amakids.com/images/pages/ma/goals-block.png"
        />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card
          image="https://marvelkidsflorida.com/wp-content/uploads/2019/05/Mental-caclulation-1279x959.jpg"
        />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card
          image="https://kidgeniuschicago.com/wp-content/uploads/2019/06/mathematic-calculate-kids-.jpg"
        />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card
          image="https://thumbs.dreamstime.com/b/special-abacus-mental-math-kid-hand-183329008.jpg"
        />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card
          image="https://img.freepik.com/free-photo/mental-arithmetic-mathematics-concept-colorful-pens-pencils-numbers-abacus-scores_120794-673.jpg?size=626&ext=jpg"
        />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card
          image="https://img.freepik.com/free-photo/mental-arithmetic-mathematics-concept-colorful-pens-pencils-numbers-abacus-scores_120794-673.jpg?size=626&ext=jpg"
          :isLoading="true"
        />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card
          image="https://img.freepik.com/free-photo/mental-arithmetic-mathematics-concept-colorful-pens-pencils-numbers-abacus-scores_120794-673.jpg?size=626&ext=jpg"
          :isLoading="true"
        />
      </div>
      <div class="column is-12-mobile is-6-tablet is-4-desktop">
        <course-card
          image="https://img.freepik.com/free-photo/mental-arithmetic-mathematics-concept-colorful-pens-pencils-numbers-abacus-scores_120794-673.jpg?size=626&ext=jpg"
          :isLoading="true"
        />
      </div>
    </div>
    <div class="my-2">
      <b-button type="is-primary" icon-left="arrow-down" expanded
        >Load more</b-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CourseCard from "@/components/course/card.vue";

@Component({
  components: { CourseCard },
})
export default class Courses extends Vue {
  public filter = [];
}
</script>
