import {G, Svg, Rect, Line, Image} from '@svgdotjs/svg.js';
import stoneSkin from "@@/img/abacus/stone_yellow.svg";

const ABACUS_STONE_SLOTS_COUNT = 8;

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
  public isHighStone = false;
  public isActive = false;

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

  private verticalLine = new Line();

  public updateStone(stoneIndex: number) {
    const stone = this.stones.get(stoneIndex)!;
    if (stone.isHighStone) {
      if (stone.isActive)
        stone.inactivate();
      else
        stone.activate()
      return;
    }

    const lowStones = Array.from(this.stones)
      .filter(([index, stone]) => !stone.isHighStone && (stone.isActive ? stoneIndex < index : stoneIndex > index));

    if (stone.isActive) {
      stone.inactivate();
      for (const [, lowStone] of lowStones)
        lowStone.inactivate();
    } else {
      stone.activate();
      for (const [, lowStone] of lowStones)
        lowStone.activate();
    }

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

    for (let i = 0; i < ABACUS_STONE_SLOTS_COUNT; i++) {
      if (i == 1 || i == 2 || i == 3) continue;
      const abacusStone = new AbacusStone();
      abacusStone.draw();

      abacusStone.on('click', () => this.updateStone(i));

      const currentPosition = ((ABACUS_STONE_HEIGHT + ABACUS_MARGIN_BETWEEN_STONES) * i) + ABACUS_MARGIN_BETWEEN_STONES

      if (i === 0) // is this "high stone"
        abacusStone.isHighStone = true;

      abacusStone.y(currentPosition);
      this.add(abacusStone);
      this.stones.set(i, abacusStone);
    }
  }
}

export class AbacusColumns extends G implements Drawable {
  constructor(private readonly columns: number) {super()};

  public draw() {
    for (let i = 0; i < this.columns; i++) {
      const column = new AbacusColumn();
      column.draw();
      column.x(ABACUS_STONE_WIDTH * i);
      this.add(column);
    }
  }
}

export class AbacusValueBox extends G implements Drawable {
  private box = new Rect();

  public draw() {
    this.box.width(ABACUS_VALUE_BOX_WIDTH).height(ABACUS_VALUE_BOX_HEIGHT);
    this.box.fill(ABACUS_VALUE_BOX_BG_COLOR);
    this.box.attr({rx: 5, ry: 5});

    this.add(this.box);
  }
}

export class AbacusOuterBox extends G implements Drawable {
  private outerBox = new Rect();

  constructor(
    private readonly drawRef: Svg,
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
    private readonly drawRef: Svg,
    private readonly columns: number
  ) {
    super();
  }

  public draw() {
    const outerBox = new AbacusOuterBox(this.drawRef, this.columns);
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
