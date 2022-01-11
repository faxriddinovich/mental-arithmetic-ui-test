import {G} from '@svgdotjs/svg.js';
import { AbacusValueBox } from './value-box';
import { Drawable } from './interfaces';
import { AbacusInnerBox, AbacusOuterBox } from './frame';
import { AbacusColumns } from './column';

export class AbacusBoard extends G implements Drawable {
  private abacusValueBox = new AbacusValueBox();
  private abacusOuterBox = new AbacusOuterBox(this.columns);
  private abacusInnerBox = new AbacusInnerBox(this.columns);
  private abacusColumns = new AbacusColumns(this.columns);

  constructor(private columns: number) {super();}

  public construct() {
    this.abacusInnerBox.cy(this.abacusOuterBox.cy());
    this.abacusInnerBox.cx(this.abacusOuterBox.cx());
    this.abacusColumns.cx(this.abacusInnerBox.cx());

    if(this.columns === 1) {
      this.abacusValueBox.get(0).width(this.abacusOuterBox.width());
      this.abacusValueBox.centerText();
    }

    this.abacusValueBox.cx(this.abacusOuterBox.cx());
    this.abacusValueBox.dy(-this.abacusValueBox.height() + 6);

  }

  private listenColumnsValues() {
    //
  }

  public reset() {
    this.abacusColumns.reset();
  }

  public draw() {
    this.abacusValueBox.draw();
    this.abacusOuterBox.draw();
    this.abacusInnerBox.draw();
    this.abacusColumns.draw();

    this.abacusOuterBox.add(this.abacusInnerBox);
    this.add(this.abacusValueBox);
    this.abacusInnerBox.add(this.abacusColumns);

    this.add(this.abacusOuterBox);
  }

}
