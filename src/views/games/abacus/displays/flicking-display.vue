<template>
  <Flicking
    :options="{
      align: 'center',
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
import "@egjs/vue-flicking/dist/flicking.css";
import { Flicking } from "@egjs/vue-flicking";
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

      flickingRef.value!.on("ready", () => {
        flickingRef.value!.moveTo(0);
      });

      flickingRef.value!.on("changed", (event) => {
        event.currentTarget.currentPanel.element.classList.add("active");
      });
    });

    return { attentionTexts, flickingRef };
  },
});
</script>
<style lang="scss">
@import "bulma/sass/utilities/mixins";

@include mobile {
  .flicking-viewport {
    padding-left: 8px;
    padding-right: 8px;
  }

  .flicking-panel {
    width: 100% !important;
  }
}

@include tablet {
  .flicking-panel {
    width: 50% !important;
  }
}

@include desktop {
  .flicking-panel {
    width: 30% !important;
  }
}

.flicking-camera {
  margin-bottom: 10px;
}

.flicking-panel.active {
  box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.05),
    inset -5px -5px 5px rgba(255, 255, 255, 0.5),
    5px 5px 5px rgba(0, 0, 0, 0.05), -5px -5px 5px rgba(255, 255, 255, 0.5);
}

.flicking-panel {
  color: white;
  width: 30%;
  height: 250px;
  border-radius: 5px;
  margin-right: 15px;
  position: relative;
  padding: 10px;
  margin-top: 10px;

  .is-attention-text {
    background: #fdcb6e;
  }

  div {
    background: #6c5ce7;
    height: 100%;
    border-radius: 5px;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
  }
}
</style>

