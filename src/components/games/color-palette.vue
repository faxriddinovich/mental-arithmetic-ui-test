<template>
  <div>
    <span
      v-for="(color, index) of colors"
      :key="index"
      :class="{
        'is-color-plette-circled': true,
        'is-selected': value === color,
        ['is-' + color + '-bg-color']: true,
      }"
      @click="$emit('input', color)"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  props: {
    value: String,
  },
  setup() {
    const colors = ref<string[]>([
      "black",
      "green",
      "blue",
      "purple",
      "yellow",
      "orange",
      "red",
      "teal",
      "brown",
    ]);

    return { colors};
  },
});
</script>
<style lang="scss">
.is-color-plette-circled {
  display: inline-block;
  border-radius: 50%;
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-right: 7px;
}

.is-color-plette-circled.is-selected {
  border: 2px solid black;
}
</style>
