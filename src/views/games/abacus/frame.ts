import {G, Rect, Line} from '@svgdotjs/svg.js';
import {Drawable} from './interfaces';
import {ABACUS_FRAME_WIDTH, ABACUS_FRAME_ABSOLUTE_X_PADDING, ABACUS_STONE_SLOTS_COUNT, ABACUS_HORIZONTAL_LINE_WIDTH, ABACUS_BG_COLOR, ABACUS_STONE_WIDTH, ABACUS_STONE_HEIGHT, ABACUS_FRAME_COLOR, ABACUS_COLUMN_VERTICAL_LINE_COLOR} from './constants';

export class AbacusOuterBox extends G implements Drawable {
  private outerBox = new Rect();

  constructor(
    private columns: number
  ) {super()}

  public draw() {
    const outerBoxWidth =
      (ABACUS_STONE_WIDTH * this.columns) + (ABACUS_FRAME_WIDTH + ABACUS_FRAME_ABSOLUTE_X_PADDING);

    const outerBoxHeight = (ABACUS_STONE_HEIGHT * ABACUS_STONE_SLOTS_COUNT) + ABACUS_FRAME_WIDTH + ABACUS_HORIZONTAL_LINE_WIDTH;

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
    const innerBoxWidth = (ABACUS_STONE_WIDTH * this.columns) + ABACUS_FRAME_ABSOLUTE_X_PADDING;
    const innerBoxHeight = (ABACUS_STONE_HEIGHT * ABACUS_STONE_SLOTS_COUNT) + ABACUS_HORIZONTAL_LINE_WIDTH;

    this.innerBox.width(innerBoxWidth).height(innerBoxHeight);
    this.innerBox.fill(ABACUS_BG_COLOR);
    this.innerBox.attr({rx: 5, ry: 5});

    this.horizontalLine
      .attr({
        x1: 0,
        y1: (ABACUS_STONE_HEIGHT * 2) + ABACUS_HORIZONTAL_LINE_WIDTH / 2,
        x2: this.innerBox.width(),
        y2: (ABACUS_STONE_HEIGHT * 2) + ABACUS_HORIZONTAL_LINE_WIDTH / 2
      }).stroke({
        width: ABACUS_HORIZONTAL_LINE_WIDTH,
        color: ABACUS_COLUMN_VERTICAL_LINE_COLOR
      })

    this.add(this.innerBox);
    this.add(this.horizontalLine);
  }
}

