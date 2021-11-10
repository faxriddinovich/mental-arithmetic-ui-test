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
            <b-button icon-left="filter">{{ $t("filter") }}</b-button>
          </template>

          <b-dropdown-item value="price" aria-role="listitem">
            <b-icon icon="dollar-alt" />
            {{ $t("price") }}
          </b-dropdown-item>

          <b-dropdown-item value="popular" aria-role="listitem">
            <b-icon icon="star" />
            {{ $t("popular") }}
          </b-dropdown-item>

          <b-dropdown-item value="purchased" aria-role="listitem">
            <b-icon icon="shopping-basket" />
            {{ $t("purchased") }}
          </b-dropdown-item>
        </b-dropdown>
        <b-input
          v-model="searchText"
          class="is-flex-grow-1 ml-3"
          :placeholder="$t('course-search-input-placeholder')"
          icon="search"
        >
        </b-input>
        <b-button
          native-type="submit"
          type="is-primary"
          class="ml-3"
          icon-left="search"
          >{{ $t("search") }}</b-button
        >
      </form>
    </div>

    <div class="mt-5">
      <cloud-loading v-if="isLoading" />
      <not-found-box
        :text="$t('no-courses-found')"
        v-else-if="!courses.length"
      />
      <div v-else>
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
          <b-button type="is-primary" icon-left="arrow-down" expanded>{{
            $t("load-more")
          }}</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import CourseCard from "@/components/course/card.vue";
import CloudLoading from "@/components/cloud-loading.vue";
import NotFoundBox from "@/components/not-found-box.vue";
import { rpc } from "@/services/rpc";
import { RPC_GET_COURSES_METHOD } from "@/services/rpc/methods";
import {
  CourseContract,
  GetCoursesContract,
} from "@/services/rpc/contracts/course";

@Component({
  components: { CourseCard, CloudLoading, NotFoundBox },
})
export default class Courses extends Vue {
  @Prop(String) public res!: string;
  public filter = [];
  public searchText = "";
  public isLoading = false;
  public courses: CourseContract[] = [];

  mounted() {
    this.isLoading = true;
    rpc
      .call(RPC_GET_COURSES_METHOD, { res: this.res })
      .then((courses) => {
        this.courses = courses as any as CourseContract[];
      })
      .finally(() => (this.isLoading = false));
  }

  public search() {
    const params: GetCoursesContract = { res: this.res };
    if (this.filter.length) params["filter"] = this.filter;
    if (this.searchText.length) params["searchText"] = this.searchText;

    this.isLoading = true;
    rpc
      .call(RPC_GET_COURSES_METHOD, params)
      .then((courses) => {
        this.courses = courses as any as CourseContract[];
      })
      .finally(() => (this.isLoading = false));
  }
}
</script>
