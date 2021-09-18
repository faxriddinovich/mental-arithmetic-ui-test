<template>
  <div class="card">
    <div class="card-image is-relative" v-if="course.image">
      <b-image
        :src="fsBucketUrl + '/' + course.image"
        :placeholder="require('../../../public/img/placeholder.jpg')"
        :src-fallback="require('../../../public/img/placeholder.jpg')"
        ratio="4by3"
      />
      <div class="is-bottom-left" v-if="!isLoading">
        <b-tag type="is-primary">{{ course.category }}</b-tag>
      </div>
    </div>
    <div class="card-content p-3">
      <div class="has-text-weight-semibold is-size-5">
        <b-skeleton width="70%" v-if="isLoading" />
        <div :class="detailed && 'is-card-title'" v-else>
          <router-link
            :to="{ name: 'Course', params: { id: course.id } }"
            class="has-text-dark"
            >{{ course.title }}</router-link
          >
        </div>
      </div>
      <div class="mt-3" v-if="detailed">
        <b-skeleton count="4" v-if="isLoading" />
        <span v-else>
          {{ course.description }}
        </span>
      </div>
      <div
        class="
          is-flex is-justify-content-space-between is-align-items-center
          mt-4
        "
      >
        <div>
          <div>
            <b-skeleton width="150px" v-if="isLoading" />
            <div v-else>
              <b-icon icon="user" />
              <span class="has-text-weight-semibold">{{
                course.author.username
              }}</span>
            </div>
          </div>
          <b-skeleton width="150px" v-if="isLoading" />
          <div v-else>
            <b-rate
              disabled
              icon-pack="uis"
              v-model="course.ratingAvg"
              :custom-text="course.ratingAvg"
              size="is-medium"
            ></b-rate>
          </div>
        </div>
        <div>
        <b-skeleton width="100px" v-if="isLoading"/>
        <span class="has-text-weight-bold is-size-5 has-text-primary" v-else>
          {{ formatCurrency(course.price) }}
        </span>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="card-footer-item">
        <b-skeleton v-if="isLoading" />
        <b-tooltip label="Lessons count" v-else>
          <span class="has-text-weight-semibold">
            <b-icon icon="clipboard-alt" />{{ course.lessons }}
          </span>
        </b-tooltip>
      </div>
      <div class="card-footer-item">
        <b-skeleton v-if="isLoading" />
        <b-tooltip label="Exercises count" v-else>
          <span class="has-text-weight-semibold"
            ><b-icon icon="ruler" />{{ course.tasks }}</span
          >
        </b-tooltip>
      </div>
      <div class="card-footer-item">
        <b-skeleton v-if="isLoading" />
        <b-tooltip label="Purchased count" v-else>
          <span class="has-text-weight-semibold"
            ><b-icon icon="users-alt" />{{ course.purchasedCount }}</span
          >
        </b-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { formatCurrency } from "@/common/utils";

@Component
export default class CourseCard extends Vue {
  @Prop(Object) public course!: any;
  @Prop({ type: Boolean, default: false }) public isLoading!: boolean;
  @Prop({ type: Boolean, default: false }) public detailed!: boolean;

  public rate = 3;
  public formatCurrency(amount: number) {
    return formatCurrency(amount);
  }

  public get fsBucketUrl() {
    return process.env.VUE_APP_FS_BUCKET_URL;
  }
}
</script>
<style lang="scss">
.is-card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3.8rem;
}
</style>
