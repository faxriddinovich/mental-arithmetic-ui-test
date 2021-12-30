<template>
  <div>
    <div
      class="columns is-marginless is-mobile is-multiline is-centered is-vcentered"
      style="min-height: 100vh"
      v-if="multiplayerMode"
    >
      <div
        class="column is-12-mobile is-4-tablet"
        v-for="(instanceItem, instanceItemIndex) of instances"
        :key="instanceItemIndex"
      >
        <BigNumbersGame
          :multiplayerMode="true"
          :answerAtEnd="answerAtEnd"
          :onFinish="addWaitingInstance"
          :sequence="instanceItem.sequence"
        />
      </div>
    </div>

    <div class="min-height: 100vh" v-else>
      <BigNumbersGame
        :sequence="instances[0].sequence"
        :answerAtEnd="instances[0].answerAtEnd"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType } from "@vue/composition-api";
import BigNumbersGame from "@/views/games/big-numbers/game.vue";
import { InstanceItem } from "@/views/games/big-numbers/interfaces";
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
  props: {
    answerAtEnd: {
      type: Boolean,
      requied: false,
    },
    instances: {
      type: Array as PropType<InstanceItem[]>,
      default: [],
      requied: true,
    },
    multiplayerMode: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props, context) {
    const waitingInstancesCount = ref<number>(0);
    const allInstancesFinished = computed(() => {
      return waitingInstancesCount.value === props.instances?.length;
    });

    const themeCaches: ThemeCache[] = [];

    for (const instance of props.instances) {
      for (const sequenceItem of instance.sequence) {
        const { examplesCount, rowsCount, theme, digit } = sequenceItem;

        if (
          props.instances!.length > 1 &&
          context.root.$route.query.sameExamples
        ) {
          const cachedTheme = themeCaches.find((cache) => {
            const sameExamplesCount = cache.examplesCount === examplesCount;
            const sameRowsCount = cache.rowsCount === rowsCount;
            const sameThemeName = cache.theme === theme;
            const sameDigit = cache.digit === digit;
            return (
              sameThemeName && sameExamplesCount && sameRowsCount && sameDigit
            );
          });

          if (cachedTheme) {
            sequenceItem.examples = cachedTheme.examples;
          } else {
            const examples = generateExamples(
              theme,
              examplesCount,
              rowsCount,
              digit
            );
            sequenceItem.examples = examples;
            themeCaches.push({
              theme,
              examplesCount,
              rowsCount,
              examples,
              digit,
            });
          }

          console.log(sequenceItem.examples);
        } else {
          sequenceItem.examples = generateExamples(
            theme,
            examplesCount,
            rowsCount,
            digit
          );
        }
      }
    }

    const columnClasses = computed(() => {
      const classes: string[] = [];

      classes.push("column");
      classes.push("is-12-mobile");

      if (allInstancesFinished.value) {
        classes.push("is-12-mobile");
        classes.push("is-6-desktop");
      } else {
        classes.push("is-6-tablet");
        classes.push("is-4-desktop");
      }

      return classes;
    });

    function addWaitingInstance() {
      waitingInstancesCount.value++;

      if (allInstancesFinished.value) {
        context.root.$nextTick(() => {
          context.root.$emit("display-answer-forms");
        });
      }
    }

    return {
      addWaitingInstance,
      columnClasses,
    };
  },
});
</script>
<style lang="scss" scoped>
.column {
  border: 1px dashed gray;
}
</style>
