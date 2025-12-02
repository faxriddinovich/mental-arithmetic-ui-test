<template>
  <div class="has-text-centered has-text-weight-semibold-tablet is-size-5">
    <figure class="container image is-64x64">
      <img :src="require('../../public/img/empty-box.svg')" draggable="false" />
    </figure>
    {{ text }}
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class NotFoundBox extends Vue {
  @Prop(String) public text!: string;
}
</script>
