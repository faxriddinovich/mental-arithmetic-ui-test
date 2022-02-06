<template>
  <Flicking
    :options="{
      align: 'center',
      renderOnlyVisible: true,
    }"
    ref="flickingRef"
    class="flicking"
  >
    <div
      class="flicking-panel"
      v-for="(text, index) of attentionTexts"
      :key="index"
    >
      <div class="is-attention-text">
        <scalable-text :text="text" class="is-full-size" />
      </div>
    </div>

    <template v-for="(sequenceItem, sequenceIndex) in sequence">
      <div class="flicking-panel" :key="'s' + sequenceIndex">
        <div class="is-attention-text">
          <scalable-text
            :text="'Theme ' + sequenceItem.theme"
            class="is-full-size"
          />
        </div>
      </div>

      <template v-for="(example, exampleIndex) in sequenceItem.examples">
        <div class="flicking-panel" :key="'e' + exampleIndex">
          <div class="is-attention-text">
            <scalable-text
              :text="'Example ' + (exampleIndex + 1)"
              class="is-full-size"
            />
          </div>
        </div>

        <template v-for="(row, rowIndex) in example.numbers">
          <div class="flicking-panel" :key="exampleIndex + '-' + rowIndex">
            <div>
              <scalable-text :text="String(row)" class="is-full-size" />
            </div>
          </div>
        </template>
      </template>
    </template>
  </Flicking>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import ScalableText from "@/components/scalable-text.vue";

export default defineComponent({
  props: {
    sequence: { type: Array, required: true },
  },
  components: { ScalableText, Flicking },
  setup() {
    const flickingRef = ref<Flicking>();
    const attentionTexts = ref(["Good luck!"]);

    onMounted(() => {
      flickingRef.value!.on("moveStart", () => {
        const activeNodes = flickingRef.value!.$el.querySelectorAll(".active");
        for (const node of activeNodes) node.classList.remove("active");
      });

      flickingRef.value!.on("changed", (event) => {
        event.currentTarget.currentPanel.element.classList.add("active");
      });
    });

    return { attentionTexts, flickingRef };
  },
});
</script>

