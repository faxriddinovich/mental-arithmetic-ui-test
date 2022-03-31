import { G, Rect, Text } from "@svgdotjs/svg.js";
import {
  ABACUS_VALUE_BOX_WIDTH,
  ABACUS_VALUE_BOX_HEIGHT,
  ABACUS_VALUE_BOX_BG_COLOR,
} from "./constants";
import { Drawable } from "./interfaces";

export class AbacusValueBox extends G implements Drawable {
  private value = new Text();
  private box = new Rect();

  public draw() {
    this.box.width(ABACUS_VALUE_BOX_WIDTH).height(ABACUS_VALUE_BOX_HEIGHT);
    this.box.fill(ABACUS_VALUE_BOX_BG_COLOR);
    this.box.attr({ rx: 5, ry: 5 });

    this.value.text("0").fill("white").font({ size: "3em" });
    this.centerText();

    this.add(this.box);
    this.add(this.value);
  }

  public centerText() {
    this.value.cx(this.box.bbox().cx);
    this.value.cy(this.box.bbox().cy);
  }

  public reset() {
    this.setText(0);
  }

  public setText(value: any) {
    this.value.text(value);
    this.centerText();
  }
}
