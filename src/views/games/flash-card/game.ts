import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  watch,
  computed,
  Ref,
} from "@vue/composition-api";
import { SVG } from "@svgdotjs/svg.js";
import { AbacusBoard } from "@/views/games/abacus/board";

export default defineComponent({
  setup(_, context) {
    const abacusContainerRef = ref<HTMLElement>();
    const imgref = ref<HTMLElement>();
    const abacusBoard = new AbacusBoard(1);

    context.root.$nextTick(() => {
      const abacusDraw = SVG()
        .addTo(abacusContainerRef.value!)
        .viewbox(0, -55, 320, 469)
        .addClass("is-abacus-board");
      abacusBoard.draw();
      abacusDraw.add(abacusBoard);
      abacusBoard.construct();

      /*
      setTimeout(() => {
        const str = new XMLSerializer().serializeToString(abacusDraw.node);
        const decoded = decodeURIComponent(encodeURIComponent(str));
        const base64 = btoa(decoded);
        imgref.value!.setAttribute(
          "src",
          "data:image/svg+xml;base64," + base64
        );
      }, 5000);
      */
    });

    return { abacusContainerRef, imgref };
  },
});
