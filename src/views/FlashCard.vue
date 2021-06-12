<template>
  <div
    class="box ml-4 mt-4 p-0 is-inline-block"
    style="border: #6d5c49 solid 15px; border-radius: 20px" 
  >
    <img
      v-for="index in 6"
      :key="index"
      width="50"
      class="abacus_row"
src="../../public/abacus/skins/yellow/full.svg"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class FlashCard extends Vue {}
</script>

<style>
.abacus_row {
  margin-bottom: -7px;
user-drag: none;
}
</style>
