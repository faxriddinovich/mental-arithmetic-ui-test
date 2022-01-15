import {SVG, Text} from '@svgdotjs/svg.js';
import {Drawable} from './interfaces';

export class NumbersViewBox extends Text implements Drawable {
  constructor(public displayNumbers: any[]) {
    super();
  }

  public display(index: number) {
    const chunks = this.children();
    const currChunk = chunks[index];
    const prevChunk = chunks[index - 1];
    if (currChunk) {
      this.animate(200).dx((window.innerWidth / 2) - (currChunk.rbox().cx));
      currChunk.fill('rgba(0, 0, 0, .7)');
    }

    if(prevChunk && currChunk) {
      prevChunk.fill('rgba(0, 0, 0, .3)');
    }
  }

  public resize() {
    //
  }

  private drawNumbers() {
    const numbers = this.text((text) => {
      for (const number of this.displayNumbers)
        text.tspan(number);
    })

    numbers.font({size: "10em", weight: "bold"});
    numbers.addClass('is-abacus-display-number-3-3');
    numbers.fill("rgba(0, 0, 0, .2)");
    numbers.attr({'dominant-baseline': "hanging"});
  }

  public draw() {
    this.drawNumbers();
  }
}
