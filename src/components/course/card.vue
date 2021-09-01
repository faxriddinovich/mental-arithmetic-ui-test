<template>
  <div class="card">
    <div class="card-image is-relative">
      <figure class="image is-4by3">
        <img
          :src="image || 'https://img.freepik.com/free-photo/abacus-mental-arithmetic-blue-background-with-examples-solve_101510-129.jpg?size=626&ext=jpg'"
        />
      </figure>
      <div class="is-bottom-left">
        <b-tag type="is-primary">Mental arithmetic</b-tag>
      </div>
    </div>
    <div class="card-content p-3">
      <div class="has-text-weight-semibold is-size-5">
        Mental arithmetic courses
      </div>
      <div class="mt-1 is-size-6">
        Having suitable skill in multiple things, but not being an expert in any
        of them. Having suitable skill in multiple things, but not being an
        expert in any of them.
      </div>
      <div class="is-flex is-justify-content-space-between is-align-items-center mt-1">
        <div><b-icon icon="user" /> <span class="has-text-weight-semibold">Satoshi Nakamoto</span></div>
        <div class="has-text-weight-bold has-text-primary is-size-5">128 000</div>
      </div>
    </div>
    <div class="card-footer">
      <div class="card-footer-item">
      <b-tooltip label="Lessons count">
        <span class="has-text-weight-semibold"
          ><b-icon icon="clipboard-alt" />23</span
        >
        </b-tooltip>
      </div>
      <div class="card-footer-item">
      <b-tooltip label="Exercises count">
        <span class="has-text-weight-semibold"><b-icon icon="ruler" />2</span>
        </b-tooltip>
      </div>
      <div class="card-footer-item">
      <b-tooltip label="Purchased count">
        <span class="has-text-weight-semibold"
          ><b-icon icon="users-alt" />23</span
        >
        </b-tooltip>
      </div>
      <div class="card-footer-item">
      <b-tooltip label="Rating">
        <span class="has-text-weight-semibold"><b-icon icon="star" />4.2</span>
        </b-tooltip>
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
}
</script>
