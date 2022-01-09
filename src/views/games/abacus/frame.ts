import {G, Svg, Rect, Line, Image, SVG, Text} from '@svgdotjs/svg.js';
import stoneSkin from "@@/img/abacus/stone_yellow.svg";

const ABACUS_STONE_SLOTS_COUNT = 8;
const ABACUS_ACTUAL_STONES_COUNT = 5;

const ABACUS_STONE_WIDTH = 100;
const ABACUS_STONE_HEIGHT = 50;

const ABACUS_FRAME_COLOR = "rgb(104, 93, 75)"
const ABACUS_BG_COLOR = "rgb(237, 243, 244)";
const ABACUS_VALUE_BOX_BG_COLOR = "rgb(104, 93, 75)";

const ABACUS_COLUMN_VERTICAL_LINE_WIDTH = 20;
const ABACUS_COLUMN_VERTICAL_LINE_COLOR = "#4D4D4D";

const ABACUS_COLUMN_HORIZONTAL_LINE_WIDTH = 15;

const ABACUS_VALUE_BOX_WIDTH = 200;
const ABACUS_VALUE_BOX_HEIGHT = 60;

const ABACUS_FRAME_WIDTH = 40;

const ABACUS_FRAME_X_PADDING = 40;
const ABACUS_MARGIN_BETWEEN_STONES = 5;

interface Drawable {
  draw(): void;
}

export class AbacusStone extends Image implements Drawable {
  public isActive = false;
  public value = 0;
  public isHighStone = false;

  public draw() {
    this.load(stoneSkin)
      .size(ABACUS_STONE_WIDTH, ABACUS_STONE_HEIGHT)
      .css('cursor', 'pointer')
  }

  public activate() {
    this.animate(100).dy(this.isHighStone ? 55 : -55); // FIXME: static size
    this.isActive = true;
  }

  public inactivate() {
    this.animate(100).dy(this.isHighStone ? -55 : 55);
    this.isActive = false;
  }
}

export class AbacusColumn extends G implements Drawable {
  private stones: Map<number, AbacusStone> = new Map();
  private value = 0;
  private verticalLine = new Line();

  public updateStone(stoneIndex: number) {
    const stone = this.stones.get(stoneIndex)!;
    if (stone.isHighStone) {
      if (stone.isActive) {
        stone.inactivate();
        this.value -= stone.value;
      } else {
        stone.activate()
        this.value += stone.value;
      }
    } else {

      const lowStones = Array.from(this.stones)
        .filter(([index, stone]) => !stone.isHighStone && (stone.isActive ? stoneIndex < index : stoneIndex > index));

      if (stone.isActive) {
        stone.inactivate();
        this.value -= 1;
        for (const [, lowStone] of lowStones) {
          lowStone.inactivate();
          this.value -= 1;
        }
      } else {
        stone.activate();
        this.value += 1;
        for (const [, lowStone] of lowStones) {
          lowStone.activate();
          this.value += 1;
        }
      }
    }
    this.dispatch('update', {value: this.value});
  }

  public draw() {
    this.verticalLine
      .attr({
        x1: ABACUS_STONE_WIDTH / 2,
        y1: 0,
        x2: ABACUS_STONE_WIDTH / 2,
        y2: ((ABACUS_STONE_HEIGHT + ABACUS_MARGIN_BETWEEN_STONES)) * ABACUS_STONE_SLOTS_COUNT
      }).stroke({
        width: ABACUS_COLUMN_VERTICAL_LINE_WIDTH,
        color: ABACUS_COLUMN_VERTICAL_LINE_COLOR
      })

    this.add(this.verticalLine);
    for (let i = 0, j = 0; i < ABACUS_STONE_SLOTS_COUNT; i++) {
      if ([1, 2, 3].includes(i)) continue;

      const abacusStone = new AbacusStone();
      abacusStone.isHighStone = i == 0;
      abacusStone.value = i == 0 ? 5 : j;
      abacusStone.draw();

      abacusStone.on('click', () => this.updateStone(i));

      const currentPosition = ((ABACUS_STONE_HEIGHT + ABACUS_MARGIN_BETWEEN_STONES) * i) + ABACUS_MARGIN_BETWEEN_STONES

      abacusStone.y(currentPosition);
      this.add(abacusStone);
      this.stones.set(i, abacusStone);
      j++;
    }
  }
}

export class AbacusColumns extends G implements Drawable {
  constructor(private readonly columns: number) {super()};

  public draw() {
    for (let i = 0; i < this.columns; i++) {
      const column = new AbacusColumn();
      column.draw();
      column.on('update', (value) => {
        this.dispatch('update', {index: i, value: value.detail.value});
      });
      column.x(ABACUS_STONE_WIDTH * i);
      this.add(column);
    }
  }
}

export class AbacusValueBox extends G implements Drawable {
  private value = new Text();
  private box = new Rect();

  public draw() {
    this.box.width(ABACUS_VALUE_BOX_WIDTH).height(ABACUS_VALUE_BOX_HEIGHT);
    this.box.fill(ABACUS_VALUE_BOX_BG_COLOR);
    this.box.attr({rx: 5, ry: 5});

    this.value.text('0').fill('white').font({ size: '3em' });
    this.value.cx(this.box.cx());
    this.value.cy(this.box.cy());

    this.add(this.box);
    this.add(this.value);
  }

  public setText(value: any) {
    this.value.text(value);
    this.value.cx(this.box.cx());
    this.value.cy(this.box.cy());
  }
}

export class AbacusOuterBox extends G implements Drawable {
  private outerBox = new Rect();

  constructor(
    private readonly columns: number
  ) {super()}

  public draw() {
    const outerBoxWidth =
      (ABACUS_STONE_WIDTH * this.columns) + ABACUS_FRAME_WIDTH + ABACUS_FRAME_X_PADDING;
    const outerBoxHeight = ((ABACUS_STONE_HEIGHT + ABACUS_MARGIN_BETWEEN_STONES) * ABACUS_STONE_SLOTS_COUNT) + ABACUS_FRAME_WIDTH;

    this.outerBox.width(outerBoxWidth).height(outerBoxHeight);
    this.outerBox.fill(ABACUS_FRAME_COLOR);
    this.outerBox.attr({rx: 5, ry: 5});

    this.add(this.outerBox);
  }
}

export class AbacusInnerBox extends G implements Drawable {
  private readonly innerBox = new Rect();
  private readonly horizontalLine = new Line();

  constructor(private readonly columns: number) {super()};

  public draw() {
    const innerBoxWidth = (ABACUS_STONE_WIDTH * this.columns) + ABACUS_FRAME_X_PADDING;
    const innerBoxHeight = (ABACUS_STONE_HEIGHT + ABACUS_MARGIN_BETWEEN_STONES) * ABACUS_STONE_SLOTS_COUNT;;

    this.innerBox.width(innerBoxWidth).height(innerBoxHeight);
    this.innerBox.fill(ABACUS_BG_COLOR);
    this.innerBox.attr({rx: 5, ry: 5});

    this.horizontalLine
      .attr({
        x1: 0,
        y1: 140,
        x2: this.innerBox.width(),
        y2: 140
      }).stroke({
        width: ABACUS_COLUMN_HORIZONTAL_LINE_WIDTH,
        color: ABACUS_COLUMN_VERTICAL_LINE_COLOR
      })

    this.add(this.innerBox);
    this.add(this.horizontalLine);
  }
}

export class AbacusBoard extends G implements Drawable {

  constructor(
    private readonly columns: number
  ) {
    super();
  }

  public draw() {
    const outerBox = new AbacusOuterBox(this.columns);
    const innerBox = new AbacusInnerBox(this.columns);
    outerBox.draw();
    innerBox.draw();
    this.add(outerBox);
    outerBox.add(innerBox);
    this.add(innerBox);

    innerBox.cx(outerBox.cx());
    innerBox.cy(outerBox.cy());
  }

}
