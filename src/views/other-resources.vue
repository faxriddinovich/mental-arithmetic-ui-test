<template>
  <div>
    <courses class="mt-4" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Courses from "@/views/course/courses.vue";

@Component({ components: { Courses } })
export default class OtherResources extends Vue {}
</script>
