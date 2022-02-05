<template>
  <section class="hero is-fullheight">
    <div class="hero-body is-justify-content-center p-0">
      <div
        class="columns is-gapless is-centered"
        style="min-width: 100%"
      >
        <div class="column is-5-fullhd is-three-quarters-desktop">
          <div class="box mx-2">
            <div class="is-size-3 has-text-weight-semibold has-text-centered">
              <span
                v-for="(row, rowIndex) of example.numbers"
                :key="rowIndex"
              >
                {{ normalizeSign(row) }}&nbsp;
              </span>
              <div class="has-text-centered">
                <span class="has-text-success has-text-weight-bold is-size-2"
                  >= {{ example.answer }}</span
                >
              </div>
            </div>

            <hr class="my-4" />
            <div class="field is-grouped is-grouped-multiline">
              <div
                class="control"
                v-for="(row, rowIndex) in example.numbers.length - 1"
                :key="rowIndex"
              >
                <div class="tags has-addons">
                  <span class="tag is-medium"
                    ><span class="has-text-weight-bold"
                      >{{ example.answerMap[rowIndex] }}&nbsp;</span
                    >
                    {{ normalizeSign(example.numbers[rowIndex + 1]) }}
                    =
                  </span>
                  <span class="tag is-primary is-medium">{{
                    example.answerMap[rowIndex + 1]
                  }}</span>
                </div>
              </div>
            </div>

            <hr class="mt-0 mb-2" />
            <div class="is-flex">
              <b-button icon-left="redo" @click="onShowAgain" expanded
                >Show again</b-button
              >
              <b-button
                icon-right="arrow-right"
                class="ml-3"
                @click="onNextExample"
                expanded
                >Next example</b-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    example: { type: Object, required: true },
    onShowAgain: { type: Function, required: true },
    onNextExample: { type: Function, required: true }
  },
  setup() {
    // TODO: we should not use this function
    const normalizeSign = (n: BigInt) => (n > 0 ? "+ " + n : n);

    return { normalizeSign };
  },
});
</script>

