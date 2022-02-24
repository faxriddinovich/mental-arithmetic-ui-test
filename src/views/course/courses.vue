<template>
  <div>
    <div class="card p-3">
      <form @submit.prevent="getCourses(true)">
        <b-field>
          <p class="control">
            <b-dropdown v-model="filter" aria-role="list" multiple>
              <template #trigger>
                <b-button>
                  <b-icon icon="filter" size="is-small" class="m-0" />
                  <span class="is-hidden-mobile ml-1">{{ $t("filter") }}</span>
                </b-button>
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
          </p>
          <b-input
            v-model="searchText"
            class="is-flex-grow-1"
            :placeholder="$t('course_search_input_placeholder')"
            icon="search"
          >
          </b-input>
          <p class="control">
            <b-button native-type="submit" type="is-primary">
              <b-icon icon="search" size="is-small" class="m-0" />
              <span class="is-hidden-mobile ml-1">{{ $t("search") }}</span>
            </b-button>
          </p>
        </b-field>
      </form>
    </div>

    <div class="mt-5">
      <cloud-loading v-if="isFetching" />

      <not-found-box :text="$t('no_courses_found')" v-else-if="!courses.length" />
      <div class="columns is-mobile is-multiline" v-else>
        <div
          class="column is-12-mobile is-6-tablet is-4-desktop"
          v-for="course of courses"
          :key="course.id"
        >
          <course-card :course="course" />
        </div>
      </div>

      <div class="my-3" v-if="canLoadMore && courses.length">
        <b-button
          type="is-primary"
          icon-left="arrow-down"
          @click="loadMore"
          :disabled="isFetching"
          expanded
          >{{ $t("load_more") }}</b-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  ref,
} from "@vue/composition-api";
import CourseCard from "@/components/course/card.vue";
import CloudLoading from "@/components/cloud-loading.vue";
import NotFoundBox from "@/components/not-found-box.vue";
import { rpc } from "@/services/rpc";
import { RPC_GET_COURSES_METHOD } from "@/services/rpc/methods";
import {
  CourseContract,
  GetCoursesContract,
  PossibleKinds,
} from "@/services/rpc/contracts/course";

export default defineComponent({
  components: { CourseCard, CloudLoading, NotFoundBox },
  props: {
    kind: {
      type: Number as PropType<PossibleKinds>,
      required: true,
    },
  },
  setup(props) {
    const filter = ref<string[]>([]);
    const searchText = ref<string>("");
    const isFetching = ref<boolean>(false);
    const courses = ref<CourseContract[]>([]);

    const canLoadMore = ref<boolean>(true);
    const currentPage = ref<number>(1);

    function getCourses(search = false) {
      isFetching.value = true;
      const params: GetCoursesContract = { kind: props.kind };

      if(searchText.value.length)
        params.searchText = searchText.value;

      if(filter.value.length)
        params.filter = filter.value;

      if(search) {
        currentPage.value = 1;
        canLoadMore.value = true;
      }

      params.page = currentPage.value;

      rpc
        .call(RPC_GET_COURSES_METHOD, params)
        .then((result) => {
          if(search)
            return courses.value = result;

          if(result.length)
            courses.value.push(...result);
          else
            canLoadMore.value = false;
        })
        .finally(() => {
          isFetching.value = false;
        });
    }

    function loadMore() {
      currentPage.value++;
      getCourses();
    }

    onMounted(() => {
      getCourses();
    });

    return {
      filter,
      searchText,
      isFetching,
      courses,
      getCourses,
      canLoadMore,
      loadMore,
    };
  },
});
</script>
