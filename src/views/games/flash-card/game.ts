import {Component} from "vue";
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

import acquireGame, {GAME_KIND} from '@/store/game';

type DisplayKind =
    | "attention-text"
    | "abacus"
    | "enter-answer-form"
    | "enter-answers-form"
    | "enter-answer-abacus"
    | "scores";

enum SceneKind {
    ATTENTION_TEXT,
    GAME,
    SCORES
}

enum DisplayCardKind {
    ABACUS,
    NUMBER,
    ENTER_ANSWER,
    ENTER_ANSWERS,
}

class DisplayCard {
    constructor(public kind: DisplayCardKind, public value: any) {
    }
}

export default defineComponent({
    components: {AbacusBoard, HealthBar, ScoresBar},
    setup(_, context) {
        const healthBarRef = ref<Component | null>(null);
        const scoresBarRef = ref<SVGSVGElement | null>(null);
        const cardRef = ref<HTMLImageElement | null>(null);

        const v = <T extends Ref>(ref: T): T extends Ref<infer K> ? K : unknown =>
            ref.value;

        console.log(acquireGame().get(GAME_KIND.FLASH_CARD));

        const timelineRef = ref<HTMLElement | null>(null);

        const canDisplayResourcesBar = ref<boolean>(true);
        const canDisplayGameForm = ref<boolean>(true);

        const abacusDisplayRef = ref<HTMLElement | null>(null);
        const enterAnswerFormDisplayRef = ref<HTMLElement | null>(null);
        const enterAnswersFormDisplayRef = ref<HTMLElement | null>(null);
        const displayKind = ref<DisplayKind>("attention-text");

        const correctOverlayIconRef = ref<HTMLElement | null>(null);
        const correctOverlayRef = ref<HTMLElement | null>(null);

        const scoresTimerRef = ref<HTMLElement | null>(null);
        const scoresCoinRef = ref<HTMLElement | null>(null);

        const displayAttentionText = () => (displayKind.value = "attention-text");
        const displayAbacus = () => {
            displayKind.value = "abacus";
            context.root.$nextTick(() => {
                animate({
                    targets: [abacusDisplayRef.value!!],
                    opacity: [0, 1],
                    scale: [1.1, 1],
                    delay: animate.stagger(100),
                });

                animate({
                    targets: timelineRef.value,
                    width: ["100%", "0%"],
                    //easing: "easeInOutExpo",
                    easing: "linear",
                    duration: 1800,
                    complete: () => {
                        v(timelineRef)!.classList.remove("warning");
                        v(timelineRef)!.classList.add("success");
                        displayEnterAnswerForm();
                    },
                    update: (anim) => {
                        if (anim.progress >= 60) {
                            v(timelineRef)!.classList.remove("success");
                            v(timelineRef)!.classList.add("warning");
                        }
                    },
                });
            });
        };

        const displayEnterAnswersForm = () => {
            displayKind.value = "enter-answers-form";
        };

        const playCorrectOverlayAnimation = () => {
            v(correctOverlayRef)!.style.display = "block";
            v(correctOverlayRef)!.style.opacity = "1";
            animate({
                targets: correctOverlayIconRef.value,
                opacity: [0, 1],
                scale: [1.3, 1],
                endDelay: 200,
                complete: () => {
                    v(correctOverlayRef)!.style.display = "none";
                    v(correctOverlayRef)!.style.opacity = "0";
                    displayAbacus();
                },
            });
        };

        const displayEnterAnswerForm = () => {
            displayKind.value = "enter-answer-form";
            context.root.$nextTick(() => {
                animate({
                    targets: [enterAnswerFormDisplayRef.value!],
                    opacity: [0, 1],
                    scale: [1.1, 1],
                    delay: animate.stagger(100),
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
              autoplay: true,
              targets: [starRef0.value!, starRef1.value, starRef2.value],
              scale: [
                { value: 1.2, duration: 100, easing: "easeOutExpo" },
                { value: 1, duration: 900 },
              ],
              delay: animate.stagger(600),
            });
            animate({
              autoplay: true,
              targets: [scoresTimerRef.value, scoresCoinRef.value],
              scale: [
                { value: 1.1, duration: 100, easing: "easeOutExpo" },
                { value: 1, duration: 900 },
              ],
              delay: animate.stagger(600),
            });
            */

            const barAnim = animate.timeline({
                autoplay: false,
            });

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
                width: ["0%", "100%"],
                //scale: 1.1,
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
            enterAnswerFormDisplayRef,
            enterAnswersFormDisplayRef,
            correctOverlayIconRef,
            correctOverlayRef,
            playCorrectOverlayAnimation,

            canDisplayResourcesBar,
            canDisplayGameForm,

            scoresTimerRef,
            scoresCoinRef,

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
            displayAbacus,
        };
    },
});
