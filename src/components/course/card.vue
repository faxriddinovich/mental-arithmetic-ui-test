<template>
  <div class="card">
    <div class="card-image is-relative">
      <b-skeleton :active="isLoading" height="263px" />
      <template v-if="!isLoading">
        <figure class="image is-4by3">
          <img
            :src="
              image ||
              'https://img.freepik.com/free-photo/abacus-mental-arithmetic-blue-background-with-examples-solve_101510-129.jpg?size=626&ext=jpg'
            "
          />
        </figure>
      </template>
      <div class="is-bottom-left">
        <template v-if="!isLoading">
          <b-tag type="is-primary">Mental arithmetic</b-tag>
        </template>
      </div>
    </div>
    <div class="card-content p-3">
      <div class="has-text-weight-semibold is-size-5">
        <template v-if="!isLoading">Mental arithmetic courses</template>
        <b-skeleton :active="isLoading" />
      </div>
      <div class="mt-1 is-size-6">
        <template v-if="!isLoading">
          Having suitable skill in multiple things, but not being an expert in
          any of them. Having suitable skill in multiple things, but not being
          an expert in any of them.
        </template>
        <b-skeleton :active="isLoading" count="5" :rounded="false" />
      </div>
      <div
        class="
          is-flex is-justify-content-space-between is-align-items-center
          mt-1
        "
      >
        <div>
          <template v-if="!isLoading">
            <b-icon icon="user" />
            <span class="has-text-weight-semibold"> Satoshi Nakamoto </span>
          </template>
          <b-skeleton :active="isLoading" width="120px" />
        </div>
        <div class="has-text-weight-bold has-text-primary is-size-5">
          <template v-if="!isLoading">128 000</template>
          <b-skeleton :active="isLoading" width="80px" />
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="card-footer-item">
        <template v-if="!isLoading">
          <b-tooltip label="Lessons count">
            <span class="has-text-weight-semibold">
              <b-icon icon="clipboard-alt" />23
            </span>
          </b-tooltip>
        </template>
        <b-skeleton :active="isLoading" width="50px" position="is-centered" />
      </div>
      <div class="card-footer-item">
        <template v-if="!isLoading">
          <b-tooltip label="Exercises count">
            <span class="has-text-weight-semibold"
              ><b-icon icon="ruler" />2</span
            >
          </b-tooltip>
        </template>
        <b-skeleton :active="isLoading" width="50px" position="is-centered" />
      </div>
      <div class="card-footer-item">
        <template v-if="!isLoading">
          <b-tooltip label="Purchased count">
            <span class="has-text-weight-semibold"
              ><b-icon icon="users-alt" />23</span
            >
          </b-tooltip>
        </template>
        <b-skeleton :active="isLoading" width="50px" position="is-centered" />
      </div>
      <div class="card-footer-item">
        <template v-if="!isLoading">
          <b-tooltip label="Rating">
            <span class="has-text-weight-semibold"
              ><b-icon icon="star" />4.2</span
            >
          </b-tooltip>
        </template>
        <b-skeleton :active="isLoading" width="50px" position="is-centered" />
      </div>
    </div>

    <!--
    <div class="card-footer">
      <div class="card-footer-item p-1">
      </div>
    </div>
      -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class CourseCard extends Vue {
  @Prop(String) public image!: string;
  @Prop(Boolean) public isLoading: boolean;
}
</script>
