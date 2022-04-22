import { Component } from "vue";
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  watch,
  computed,
  Ref,
} from "@vue/composition-api";
import AbacusBoard from "@/components/games/abacus-board";
import HealthBar from "@/components/games/health-bar";
import ScoresBar from "@/components/games/scores-bar";
import animate from "animejs";

type DisplayKind = "attention-text" | "abacus";

export default defineComponent({
  components: { AbacusBoard, HealthBar, ScoresBar },
  setup(_, context) {
    const healthBarRef = ref<Component | null>(null);
    const scoresBarRef = ref<SVGSVGElement | null>(null);
    const cardRef = ref<HTMLImageElement | null>(null);

    const v = <T extends Ref>(ref: T): T extends Ref<infer K> ? K : unknown =>
      ref.value;

    const timelineRef = ref<HTMLElement | null>(null);

    const abacusDisplayRef = ref<HTMLElement | null>(null);
    const displayKind = ref<DisplayKind>("attention-text");

    const displayAttentionText = () => (displayKind.value = "attention-text");
    const displayAbacus = () => {
      displayKind.value = "abacus";
      context.root.$nextTick(() => {
        animate({
          targets: [abacusDisplayRef.value!!],
          opacity: [0, 1],
          scale: 1.1,
          delay: animate.stagger(100),
        });

        animate({
          targets: timelineRef.value,
          width: "0%",
          easing: 'easeInOutExpo',
          duration: 3000,
        });


      });
    };

    const starRef0 = ref<HTMLImageElement | null>(null);
    const starRef1 = ref<HTMLImageElement | null>(null);
    const starRef2 = ref<HTMLImageElement | null>(null);

    const text = ref<string>("Ready?");
    const textRef = ref<HTMLSpanElement | null>(null);

    const cards = ref<SVGElement | null>(null);

    const yellowCardRef = ref<Component | null>(null);
    const redCardRef = ref<SVGElement | null>(null);

    const modal = ref<boolean>(false);

    onMounted(() => {
      /*
      const starAnim = animate({
        autoplay: false,
        targets: [starRef0.value!, starRef1.value, starRef2.value],
        translateY: [-140, 100],
        scaleY: [
          { value: 1.5, duration: 100, easing: "easeOutExpo" },
          { value: 1, duration: 900 },
        ],
        delay: animate.stagger(600),
      });
      */

      const barAnim = animate.timeline({ autoplay: false });

      barAnim
        .add({
          targets: [cardRef.value],
          translateY: [-100, 0],
        })
        .add(
          {
            targets: [healthBarRef.value!.$el, scoresBarRef.value.$el],
            translateY: [-100, 0],
          },
          200
        );

      const textAnim = animate({
        targets: [textRef.value!],
        opacity: [0, 1],
        scale: 1.1,
        delay: animate.stagger(100),
        complete: () => {
          if (text.value == "Good luck!") {
            displayAbacus();
            barAnim.play();
            return;
          }
          text.value = "Good luck!";
          textAnim.play();
        },
      });
    });

    return {
      displayKind,
      abacusDisplayRef,
      starRef0,
      starRef1,
      starRef2,
      cards,
      yellowCardRef,
      redCardRef,
      modal,
      healthBarRef,
      scoresBarRef,
      cardRef,
      text,
      textRef,
      timelineRef,
    };
  },
});
