<template>
  <svg ref="barRef" viewBox="0 0 400 70" :width="width" :height="height">
    <defs>
      <filter id="scores-circle-shadow" width="200%" height="200%">
        <feFlood flood-color="rgba(0, 0, 0, 0.2)" />
        <feComposite operator="out" in2="SourceGraphic" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite operator="atop" in2="SourceGraphic" />
      </filter>
      <filter id="scores-rect-shadow" width="200%" height="200%">
        <feFlood flood-color="rgba(0, 0, 0, 0.1)" />
        <feComposite operator="out" in2="SourceGraphic" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite operator="atop" in2="SourceGraphic" />
      </filter>

      <linearGradient id="scores-rect-gradient" x1="1.3" x2="1.3" y2="0.6">
        <stop offset="90%" stop-color="#f7ca18" />
        <stop offset="90%" stop-color="#e8be17" />
      </linearGradient>
    </defs>
  </svg>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { SVG, G, Rect, Circle } from "@svgdotjs/svg.js";
import Star from "@@/star.png";

export default defineComponent({
  props: {
    width: { type: Number, default: 400 },
    height: { type: Number, default: 70 },
  },
  setup() {
    const barRef = ref<SVGSVGElement | null>(null);

    onMounted(() => {
      const draw = SVG();
      draw.node = barRef.value!;

      const healthBar = draw.group();

      const gcircle = new G();
      const circle = draw
        .circle(60)
        .fill("#fff")
        .stroke({ width: 5, color: "#dfe6e9" })
        .css("filter", "url(#scores-circle-shadow)");

      const heart = draw.image(Star).size(40, 40);
      heart.cx(circle.cx());
      heart.cy(circle.cy());

      const grect = new G();
      const rect = grect
        .rect(350, 35)
        .fill("#dfe6e9")
        .attr("rx", 20)
        .attr("ry", 25);
      rect.x((circle.x() as number) + (circle.width() as number) - 15);
      rect.cy(circle.cy());
      rect.css("filter", "url(#scores-rect-shadow)");

      const rect2 = grect.rect(330, 22).fill("url(#scores-rect-gradient)");
      rect2.x((rect.x() as number) + 10);
      rect2.cy(rect.cy());
      rect2.attr("rx", 10);
      rect2.attr("ry", 10);

      gcircle.add(circle);
      gcircle.add(heart);

      healthBar.add(grect);
      healthBar.add(gcircle);
      gcircle.x(grect.x() + grect.width() - 20);
      healthBar.move(5, 5);
    });

    return { barRef };
  },
});
</script>
