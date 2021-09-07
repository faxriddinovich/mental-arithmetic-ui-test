<template>
  <div class="card">
    <div class="card-image is-relative">
      <figure class="image is-4by3">
        <img :src="course.image" />
      </figure>
      <div class="is-bottom-left">
        <b-tag type="is-primary">{{ course.category }}</b-tag>
      </div>
    </div>
    <div class="card-content p-3">
      <div class="has-text-weight-semibold is-size-5">
        {{ course.title }}
      </div>
      <div class="mt-1 is-size-6">
        {{ course.description }}
      </div>
      <div
        class="
          is-flex is-justify-content-space-between is-align-items-center
          mt-1
        "
      >
        <div>
          <b-icon icon="user" />
          <span class="has-text-weight-semibold">{{
            course.author.username
          }}</span>
        </div>
        <div class="has-text-weight-bold is-size-5">
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
        <b-tooltip label="Lessons count">
          <span class="has-text-weight-semibold">
            <b-icon icon="clipboard-alt" />{{ course.lessons }}
          </span>
        </b-tooltip>
      </div>
      <div class="card-footer-item">
        <b-tooltip label="Exercises count">
          <span class="has-text-weight-semibold"
            ><b-icon icon="ruler" />{{ course.tasks }}</span
          >
        </b-tooltip>
      </div>
      <div class="card-footer-item">
        <b-tooltip label="Purchased count">
          <span class="has-text-weight-semibold"
            ><b-icon icon="users-alt" />{{ course.purchCount }}</span
          >
        </b-tooltip>
      </div>
      <div class="card-footer-item">
        <b-tooltip label="Rating">
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

@Component
export default class CourseCard extends Vue {
  @Prop(Object) public course!: any;

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    })
      .formatToParts(amount)
      .map((p) => (p.type != "literal" && p.type != "currency" ? p.value : ""))
      .join("");
  }
}
</script>
