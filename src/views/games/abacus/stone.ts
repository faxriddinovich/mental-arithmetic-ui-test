import { Image } from '@svgdotjs/svg.js';
import { Drawable } from './interfaces';
import { ABACUS_STONE_WIDTH, ABACUS_STONE_HEIGHT } from './constants';

import stoneSkin from "@@/img/abacus/stone_yellow.svg";

export class AbacusStone extends Image implements Drawable {
  public isActive = false;
  public value = 0;
  public isHighStone = false;

  public draw() {
    this.load(stoneSkin)
      .size(ABACUS_STONE_WIDTH, ABACUS_STONE_HEIGHT)
      .css('cursor', 'pointer')
      .attr({class: "is-highlightless"});
  }

  public activate() {
    if(!this.isActive) {
      this.animate(100).dy(this.isHighStone ? ABACUS_STONE_HEIGHT : -ABACUS_STONE_HEIGHT);
      this.isActive = true;
    }
  }

  public inactivate() {
    if(this.isActive) {
      this.animate(100).dy(this.isHighStone ? -ABACUS_STONE_HEIGHT : ABACUS_STONE_HEIGHT);
      this.isActive = false;
    }
  }
}
