<template>
        <div class="card">
          <div class="card-image">
            <figure class="image">
              <img
                src="https://img.freepik.com/free-photo/abacus-mental-arithmetic-blue-background-with-examples-solve_101510-129.jpg?size=626&ext=jpg"
              />
            </figure>
          </div>
          <div class="card-content p-3">
            <div class="has-text-weight-semibold is-size-5">
              Mental arithmetic courses
            </div>
            <div class="mt-1 is-size-6">
              Having suitable skill in multiple things, but not being an expert
              in any of them. Having suitable skill in multiple things, but not
              being an expert in any of them.
            </div>
            <div class="is-flex is-justify-content-space-between mt-2">
              <span class="has-text-weight-semibold"
                ><b-icon icon="clipboard-alt" />23</span
              >
              <span class="has-text-weight-semibold"
                ><b-icon icon="ruler" />0</span
              >
              <span class="has-text-weight-semibold"
                ><b-icon icon="users-alt" />23</span
              >
            </div>
          </div>
          <hr class="my-0" />
          <div class="p-2">
            <div class="is-flex is-align-items-center">
              <figure class="image is-32x32">
                <img
                  src="https://i1.wp.com/katzenworld.co.uk/wp-content/uploads/2019/06/funny-cat.jpeg?fit=1920%2C1920&ssl=1"
                  class="is-rounded is-inline"
                />
              </figure>
              <div>
                <div class="ml-2 has-text-weight-semibold">Administrator</div>
              </div>
            </div>
          </div>
          </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class CourseCard extends Vue {}
</script>
