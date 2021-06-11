<template>
  <div
    class="box ml-4 mt-4 p-0 is-inline-block is-select-none"
    style="border: #604021 solid 15px; border-image: url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmhG4CvCzW8GLoWW87i6yVataIC35KB6OdCg&usqp=CAU) 30 round"
  >
    <img
      v-for="index in 6"
      :key="index"
      width="80"
      style="margin-bottom: -6px;"
      src="https://vectr.com/tmp/b1WLVFgiF/a4Detnl0WX.svg?width=51&height=229&select=a4Detnl0WXpage0"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class FlashCard extends Vue {}
</script>
