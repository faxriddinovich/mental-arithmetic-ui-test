<template>
  <svg ref="barRef" width="400" height="70">
    <defs>
      <filter id="circle-shadow" width="200%" height="200%">
        <feFlood flood-color="rgba(0, 0, 0, 0.2)" />
        <feComposite operator="out" in2="SourceGraphic" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite operator="atop" in2="SourceGraphic" />
      </filter>
      <filter id="rect-shadow" width="200%" height="200%">
        <feFlood flood-color="rgba(0, 0, 0, 0.1)" />
        <feComposite operator="out" in2="SourceGraphic" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite operator="atop" in2="SourceGraphic" />
      </filter>

      <linearGradient id="rect-gradient" x1="1.3" x2="1.3" y2="0.6">
        <stop offset="90%" stop-color="rgb(223, 91, 79)" />
        <stop offset="90%" stop-color="rgba(204,78,67,1)" />
      </linearGradient>
    </defs>
  </svg>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { SVG, G, Rect, Circle } from "@svgdotjs/svg.js";
import Heart from "@@/heart.png";

export default defineComponent({
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
        .css("filter", "url(#circle-shadow)");

      const heart = draw.image(Heart).size(40, 40);
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
      rect.css("filter", "url(#rect-shadow)");

      const rect2 = grect.rect(330, 22).fill("url(#rect-gradient)");
      rect2.x((rect.x() as number) + 10);
      rect2.cy(rect.cy());
      rect2.attr("rx", 10);
      rect2.attr("ry", 10);

      gcircle.add(circle);
      gcircle.add(heart);

      healthBar.add(grect);
      healthBar.add(gcircle);
      healthBar.move(5, 5);

      /*
      setInterval(() => {
        rect2.animate(100).width(rect2.width() - 5);
      }, 100);
      */
    });

    return { barRef };
  },
});
</script>

