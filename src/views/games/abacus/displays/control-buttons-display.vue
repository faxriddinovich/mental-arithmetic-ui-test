<template>
  <section class="hero is-fullheight">
    <div class="hero-body is-justify-content-center p-0">
      <div
        class="
          has-text-centered
          is-size-4-touch is-size-2-desktop
          mb-5
          mx-4
          has-text-weight-semibold
        "
      >
        <span>Please solve the expressions sequentially</span>
      </div>
      <div class="buttons is-justify-content-center">
        <b-button icon-left="redo" @click="onShowAgain">Show again</b-button>
        <b-button icon-left="align-left-justify" @click="onShowAnswer"
          >Answer</b-button
        >
        <b-button type="is-link" icon-right="arrow-right" @click="onNextExample"
          >Next</b-button
        >
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    onShowAgain: {
      type: Function,
      required: true,
    },
    onShowAnswer: {
      type: Function,
      required: true,
    },
    onNextExample: {
      type: Function,
      required: true,
    },
  }
});
</script>

