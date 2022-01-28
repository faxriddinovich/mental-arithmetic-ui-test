import {G, Rect, Text} from '@svgdotjs/svg.js';
import {ABACUS_VALUE_BOX_WIDTH, ABACUS_VALUE_BOX_HEIGHT, ABACUS_VALUE_BOX_BG_COLOR} from './constants';
import {Drawable} from './interfaces';

export class AbacusTipsButton extends G implements Drawable {
  private questionMark = new Text();
  private box = new Rect();

  public draw() {
    this.questionMark.text('?').fill('white').font({size: '30px', weight: 'bold'})
    this.css('cursor', 'pointer');

    this.box.width(50).height(50); // TODO constant
    this.box.fill(ABACUS_VALUE_BOX_BG_COLOR);
    this.box.attr({rx: 5, ry: 5});

    this.add(this.box);
    this.add(this.questionMark);
    this.questionMark.cx(this.box.cx());
    this.questionMark.cy(this.box.cy());
  }
}

export class AbacusValueBox extends G implements Drawable {
  private value = new Text();
  private box = new Rect();

  public draw() {
    this.box.width(ABACUS_VALUE_BOX_WIDTH).height(ABACUS_VALUE_BOX_HEIGHT);
    this.box.fill(ABACUS_VALUE_BOX_BG_COLOR);
    this.box.attr({rx: 5, ry: 5});

    this.value.text('0').fill('white').font({size: '3em'});
    this.centerText();

    this.add(this.box);
    this.add(this.value);
  }

  public centerText() {
    this.value.cx(this.box.cx());
    this.value.cy(this.box.cy());
  }

  public reset() {
    this.setText(0);
  }

  public setText(value: any) {
    this.value.text(value);
    this.centerText();
  }
}
