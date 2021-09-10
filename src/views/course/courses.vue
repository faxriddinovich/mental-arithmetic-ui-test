<template>
  <div>
    <div class="card p-3">
      <form @submit.prevent="search" class="is-flex">
        <b-dropdown
          v-model="filter"
          :mobile-modal="false"
          multiple
          aria-role="list"
        >
          <template #trigger>
            <b-button icon-left="filter">Filter</b-button>
          </template>

          <b-dropdown-item value="price" aria-role="listitem">
            <b-icon icon="dollar-alt" />
            Price
          </b-dropdown-item>

          <b-dropdown-item value="popular" aria-role="listitem">
            <b-icon icon="star" />
            Popular
          </b-dropdown-item>

          <b-dropdown-item value="purchased" aria-role="listitem">
            <b-icon icon="shopping-basket" />
            Purchased
          </b-dropdown-item>
        </b-dropdown>
        <b-input
          v-model="searchText"
          class="is-flex-grow-1 ml-3"
          placeholder="Course name, author name"
          icon="search"
        >
        </b-input>
        <b-button
          native-type="submit"
          type="is-primary"
          class="ml-3"
          icon-left="search"
          >Search</b-button
        >
      </form>
    </div>

    <div class="mt-5">
      <cloud-loading v-if="isLoading" />
      <not-found-box
        text="No courses found"
        v-if="!isLoading && !courses.length"
      />
      <div v-if="!isLoading && courses.length">
        <div class="columns is-mobile is-multiline">
          <div
            class="column is-12-mobile is-6-tablet is-4-desktop"
            v-for="course of courses"
            :key="course.id"
          >
            <course-card :course="course" />
          </div>
        </div>
        <div class="my-3">
          <b-button type="is-primary" icon-left="arrow-down" expanded
            >Load more</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { rpc } from "@/rpc/rpc";
import CourseCard from "@/components/course/card.vue";
import CloudLoading from "@/components/cloud-loading.vue";
import NotFoundBox from "@/components/not-found-box.vue";

@Component({
  components: { CourseCard, CloudLoading, NotFoundBox },
})
export default class Courses extends Vue {
  @Prop(String) public res;
  public filter = [];
  public searchText = "";
  public isLoading = false;
  public courses = [];

  mounted() {
    this.isLoading = true;
    rpc
      .call("get_courses", { res: this.res })
      .then((courses) => {
        this.courses = courses;
      })
      .finally(() => (this.isLoading = false));
  }

  public search() {
    const params = { res: this.res };
    if (this.filter.length) params["filter"] = this.filter;
    if (this.searchText.length) params["searchText"] = this.searchText;

    this.isLoading = true;
    rpc
      .call("get_courses", params)
      .then((courses) => {
        this.courses = courses;
      })
      .finally(() => (this.isLoading = false));
  }
}
</script>
