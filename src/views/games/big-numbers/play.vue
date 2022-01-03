<template>
  <div>
    <div class="is-bottom-left-screen mr-2 mb-2">
      <div class="card p-2 is-bordered">
        <div class="buttons">
          <b-button
            tag="router-link"
            :to="{ name: 'BigNumbersGameForm' }"
            type="is-primary is-light"
            icon-left="arrow-left"
            >Back</b-button
          >
          <b-button
            @click="emitNextExample"
            type="is-primary"
            icon-right="arrow-right"
            >Next example</b-button
          >
        </div>
      </div>
    </div>
    <div
      class="
        columns
        is-marginless is-mobile is-multiline is-centered is-vcentered
      "
      style="min-height: 100vh"
      v-if="config.multiplayerMode"
    >
      <div
        :class="columnClasses"
        v-for="(instanceItem, instanceItemIndex) of config.instances"
        :key="instanceItemIndex"
      >
        <BigNumbersGame
          :multiplayerMode="true"
          :answerAtEnd="config.answerAtEnd"
          :onFinish="addCompletedInstance"
          :sequence="instanceItem.sequence"
        />
      </div>
    </div>

    <div class="min-height: 100vh" v-else>
      <BigNumbersGame
        :sequence="config.instances[0].sequence"
        :answerAtEnd="config.instances[0].answerAtEnd"
        :onRefresh="regenerateExamples"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "@vue/composition-api";
import BigNumbersGame from "@/views/games/big-numbers/game.vue";
import { BigNumbersGameConfig } from "@/views/games/big-numbers/interfaces";
import { generateExamples, Example } from "@/services/generator";

interface ThemeCache {
  theme: string;
  examplesCount: number;
  rowsCount: number;
  digit: number;
  examples: Example[];
}

export default defineComponent({
  components: { BigNumbersGame },
  setup(props, context) {
    const rawConfig = context.root.$store.getters["BigNumbers/config"];
    const config = ref<BigNumbersGameConfig>(rawConfig);

    const completedInstancesCount = ref<number>(0);
    const instancesCompleted = computed(() => {
      return completedInstancesCount.value === config.value.instances.length;
    });

    const themeCaches: ThemeCache[] = [];

    // for each instance we generate examples
    for (const instance of config.value.instances) {
      for (const sequenceItem of instance.sequence) {
        const { examplesCount, rowsCount, theme, digit } = sequenceItem;
        if (config.value.instances.length > 1 && config.value.sameExamples) {
          const cachedTheme = themeCaches.find((cache) => {
            const sameExamplesCount = cache.examplesCount === examplesCount;
            const sameRowsCount = cache.rowsCount === rowsCount;
            const sameTheme = cache.theme === theme;
            const sameDigit = cache.digit === digit;
            return sameTheme && sameExamplesCount && sameRowsCount && sameDigit;
          });

          // if there is a cached theme
          if (cachedTheme) {
            sequenceItem.examples = cachedTheme.examples;
            continue;
          }
          // we generate examples
          const examples = generateExamples(
            theme,
            examplesCount,
            rowsCount,
            digit
          );
          sequenceItem.examples = examples;
          // and we add to the cache
          themeCaches.push({
            theme,
            examplesCount,
            rowsCount,
            examples,
            digit,
          });
          continue;
        }

        sequenceItem.examples = generateExamples(
          theme,
          examplesCount,
          rowsCount,
          digit
        );
      }
    }

    function regenerateExamples() {
      for (const instance of config.value.instances) {
        for (const sequenceItem of instance.sequence) {
          const { theme, examplesCount, rowsCount, digit } = sequenceItem;
          sequenceItem.examples = generateExamples(
            theme,
            examplesCount,
            rowsCount,
            digit
          );
        }
      }
    }

    const columnClasses = computed<string[]>(() => {
      const classes: string[] = [];

      classes.push("column");
      classes.push("is-12-mobile");

      if (instancesCompleted.value && config.value.answerAtEnd) {
        classes.push("is-12");
      } else {
        classes.push("is-6-tablet");
        classes.push("is-4-desktop");
      }

      return classes;
    });

    function addCompletedInstance() {
      completedInstancesCount.value++;

      if (instancesCompleted.value) {
        context.root.$nextTick(() => {
          context.root.$emit("display-answer-forms");
        });
      }
    }

    function emitNextExample() {
      context.root.$emit('next-example');
    }

    return {
      config,
      emitNextExample,
      addCompletedInstance,
      regenerateExamples,
      columnClasses,
    };
  },
});
</script>
