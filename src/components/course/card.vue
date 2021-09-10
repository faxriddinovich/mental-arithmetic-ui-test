<template>
  <div class="card">
    <div class="card-image is-relative">
      <b-image :src="course.image" ratio="4by3"  :placeholder="require('../../../public/img/placeholder.jpg')"/>
      <div class="is-bottom-left" v-if="!isLoading">
        <b-tag type="is-primary">{{ course.category }}</b-tag>
      </div>
    </div>
    <div class="card-content p-3">
      <div class="has-text-weight-semibold is-size-5">
        <b-skeleton width="70%" v-if="isLoading" />
        <span v-else>{{ course.title }}</span>
      </div>
      <div class="mt-1 is-size-6">
        <b-skeleton count="4" v-if="isLoading" />
        <span v-else>{{ course.description }}</span>
      </div>
      <div
        class="
          is-flex is-justify-content-space-between is-align-items-center
          mt-1
        "
      >
        <div>
          <b-skeleton width="150px" v-if="isLoading" />
          <div v-else>
            <b-icon icon="user" />
            <span class="has-text-weight-semibold">{{
              course.author.username
            }}</span>
          </div>
        </div>
        <div v-if="isLoading"><b-skeleton width="60px" /></div>
        <div class="has-text-weight-bold is-size-5" v-else>
          <span class="has-text-success" v-if="course.price === 0">
            *FREE
          </span>
          <span class="has-text-primary" v-else>
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
            ><b-icon icon="users-alt" />{{ course.purchCount }}</span
          >
        </b-tooltip>
      </div>
      <div class="card-footer-item">
        <b-skeleton v-if="isLoading" />
        <b-tooltip label="Rating" v-else>
          <span class="has-text-weight-semibold"
            ><b-icon icon="star" />{{ course.ratingAvg }}</span
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
  @Prop({ type: Boolean, default: false }) public isLoading;
  public formatCurrency(amount: number) {
    return formatCurrency(amount);
  }
}
</script>
