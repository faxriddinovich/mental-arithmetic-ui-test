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
    <div class="mt-4" v-if="isLoading">
      <course-loading />
    </div>
    <div class="columns is-mobile is-multiline mt-2" v-if="courses.length">
      <div
        class="column is-12-mobile is-6-tablet is-4-desktop"
        v-for="course of courses"
        :key="course.id"
      >
        <course-card :course="course" />
      </div>
    </div>
    <div class="my-2" v-if="!isLoading">
      <b-button type="is-primary" icon-left="arrow-down" expanded
        >Load more</b-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { rpc } from "@/rpc/rpc";
import CourseCard from "@/components/course/card.vue";
import CourseLoading from "@/components/course/loading.vue";

@Component({
  components: { CourseCard, CourseLoading },
})
export default class Courses extends Vue {
  public filter = [];
  public isLoading = true;
  public courses = [];
  mounted() {
    setTimeout( async () => {
    this.courses = await rpc.call("get_courses");
    this.isLoading = false;
    }, 5000);
  }
}
</script>
