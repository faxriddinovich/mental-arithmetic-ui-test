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
import animate from "animejs";

export default defineComponent({
  components: { AbacusBoard },
  setup(_, context) {
    const starRef0 = ref<HTMLImageElement | null>(null);
    const starRef1 = ref<HTMLImageElement | null>(null);
    const starRef2 = ref<HTMLImageElement | null>(null);

    const cards = ref<SVGElement | null>(null);

    const yellowCardRef = ref<SVGElement | null>(null);
    const redCardRef = ref<SVGElement | null>(null);

    const modal = ref<boolean>(false);
    setTimeout(() => modal.value = true, 1000);

    onMounted(() => {
      animate({
        targets: [starRef0.value!, starRef1.value, starRef2.value],
        translateY: [-100, 140],
        /*
        scale: {
          value: 2,
          duration: 1600,
          easing: "easeInOutQuart",
        },
        */
        scaleY: [
          { value: 1.5, duration: 100, easing: "easeOutExpo" },
          { value: 1, duration: 900 },
        ],
        delay: animate.stagger(100),
      });

      const card = animate.timeline({
        easing: "easeOutExpo",
      });

      card.add({
        targets: cards.value,
        translateY: [-80, 140],
        /*
        scale: {
          value: 2,
          duration: 1600,
          easing: "easeInOutQuart",
        },
        */
        scaleY: [
          { value: 1.5, duration: 100, easing: "easeOutExpo" },
          { value: 1, duration: 900 },
        ],
        delay: animate.stagger(100),
      });

      card.add(
        {
          targets: yellowCardRef.value,
          rotate: -8,
        },
        390
      );

      card.add(
        {
          targets: redCardRef.value,
          rotate: 8,
          translateY: 20,
        },
        390
      );
    });

    return { starRef0, starRef1, starRef2, cards, yellowCardRef, redCardRef , modal};
  },
});
