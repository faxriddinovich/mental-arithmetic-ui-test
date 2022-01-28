import {G} from '@svgdotjs/svg.js';
import {AbacusValueBox, AbacusTipsButton} from './value-box';
import {Drawable, UpdateEventDetail} from './interfaces';
import {AbacusInnerBox, AbacusOuterBox} from './frame';
import {AbacusColumns} from './column';

export class AbacusBoard extends G implements Drawable {
  private digits: number[] = new Array(this.columns).fill(0);
  private abacusValueBox = new AbacusValueBox();
  private abacusTipsButton = new AbacusTipsButton();
  private abacusOuterBox = new AbacusOuterBox(this.columns);
  private abacusInnerBox = new AbacusInnerBox(this.columns);
  private abacusColumns = new AbacusColumns(this.columns);

  constructor(private columns: number) {
    super();
  }

  public construct() {
    this.abacusInnerBox.cy(this.abacusOuterBox.cy());
    this.abacusInnerBox.cx(this.abacusOuterBox.cx());
    this.abacusColumns.cx(this.abacusInnerBox.cx());

    if (this.columns === 1) {
      this.abacusValueBox.get(0).width(this.abacusOuterBox.width());
      this.abacusValueBox.centerText();
    }

    this.abacusValueBox.cx(this.abacusOuterBox.cx());
    this.abacusValueBox.dy(-this.abacusValueBox.height() + 6);

    this.abacusTipsButton.x(this.abacusOuterBox.x() + this.abacusOuterBox.width() - this.abacusTipsButton.width() - 20);
    this.abacusTipsButton.y(-this.abacusTipsButton.height() + 5);
  }

  private listenColumnsValues() {
    this.abacusColumns.on('update', (event) => {
      const [digit, value] = (event as CustomEvent<UpdateEventDetail>).detail;
      this.digits[digit] = value;
      const conced = +this.digits.join('');
      if (this.digits.every((value) => value === 0))
        this.fire('update', 0);
      else
        this.fire('update', conced);

      this.abacusValueBox.setText(conced);
    });
  }

  private listenTipsButtonClick() {
    this.abacusTipsButton.on('click', () => {
      this.fire('tips-button-click');
    });
  }

  public lock() {
    this.abacusColumns.lock();
  }

  public unlock() {
    this.abacusColumns.unlock();
  }

  private resetDigits() {
    this.digits = new Array(this.columns).fill(0);
  }

  public reset() {
    this.resetDigits();
    this.abacusValueBox.reset();
    this.abacusColumns.reset();
  }

  public draw() {
    this.listenColumnsValues();
    this.listenTipsButtonClick();
    this.abacusValueBox.draw();
    this.abacusTipsButton.draw();
    this.abacusOuterBox.draw();
    this.abacusInnerBox.draw();
    this.abacusColumns.draw();

    this.abacusOuterBox.add(this.abacusInnerBox);
    this.add(this.abacusValueBox);
    this.add(this.abacusTipsButton);
    this.abacusInnerBox.add(this.abacusColumns);

    this.add(this.abacusOuterBox);
  }

}
