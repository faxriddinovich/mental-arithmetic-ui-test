import {ForeignObject, SVG, Text} from '@svgdotjs/svg.js';
import {Drawable} from './interfaces';

export class NumbersViewBox extends ForeignObject implements Drawable {
  private viewBox = SVG().viewbox(-this.viewBoxWidth, 0, this.viewBoxWidth, this.viewBoxHeight);

  constructor(
    public viewBoxWidth: number,
    public viewBoxHeight: number,
    public displayNumbers: any[]
  ) {
    super();
    this.size(viewBoxWidth, viewBoxHeight);
  }

  public display(index: number) {
    const text = this.viewBox.children()[0];
    const chunks = text.children();
    const currChunk = chunks[index];
    const prevChunk = chunks[index - 1];
    if (currChunk) {
      this.viewBox.animate(200).viewbox((currChunk.bbox().cx) - this.viewBoxWidth / 2, 0, this.viewBoxWidth, this.viewBoxHeight);
      currChunk.fill('rgba(0, 0, 0, .7)');
    }

    if(prevChunk && currChunk) {
      prevChunk.fill('rgba(0, 0, 0, .3)');
    }
  }

  public resize() {
    const chunks = this.viewBox.children()[0].children();

    for(const chunk of chunks)
      chunk.font({ size: '6rem' });
  }

  private drawNumbers() {
    const numbers = new Text().text((text) => {
      for (const number of this.displayNumbers)
        text.tspan(number);
    })

    numbers.font({size: "10em", weight: "bold"});
    numbers.fill("rgba(0, 0, 0, .2)");
    numbers.attr({'dominant-baseline': "hanging"});
    this.viewBox.add(numbers);
  }

  public draw() {
    this.add(this.viewBox);
    this.drawNumbers();
  }
}
