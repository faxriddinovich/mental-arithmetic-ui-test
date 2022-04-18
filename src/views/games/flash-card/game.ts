import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  watch,
  computed,
  Ref,
} from "@vue/composition-api";
import AbacusBoard from '@/components/games/abacus-board';

export default defineComponent({
  components: { AbacusBoard },
  setup(_, context) {
  },
});
