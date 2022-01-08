import {G, Line, Rect, Text, Svg, Container} from '@svgdotjs/svg.js';

const ABACUS_FRAME_WIDTH = 800;
const ABACUS_FRAME_HEIGHT = 400;

const ABACUS_FRAME_COLOR = "rgb(104, 93, 75)";
const ABACUS_FRAME_FILL = 'rgba(0, 0, 0, 0)';
const ABACUS_FRAME_STROKE_WIDTH = 20;
const ABACUS_FRAME_HORIZONTAL_LINE_COLOR = "#4D4D4D";

const ABACUS_FRAME_TOP_BAR_WIDTH = 200;
const ABACUS_FRAME_TOP_BAR_HEIGHT = 60;
const ABACUS_FRAME_TOP_BAR_RIGHT_SPACE = 20;

interface Drawable {
  draw(): void;
}

class AbacusFrameTopBar extends G implements Drawable {
  public _bar!: Rect;
  public _text!: Text;

  constructor(public drawing: Svg) {
    super();
    this.createTopBar();
    this.createTopBarText();
  }

  private createTopBar() {
    const topBar = new Rect({
      width: ABACUS_FRAME_TOP_BAR_WIDTH,
      height: ABACUS_FRAME_TOP_BAR_HEIGHT
    }).addTo(this.drawing);

    topBar
      .attr({
        fill: ABACUS_FRAME_COLOR,
        rx: "10",
        ry: "10",
      });

    topBar.move(
      ABACUS_FRAME_WIDTH -
      (ABACUS_FRAME_TOP_BAR_WIDTH + ABACUS_FRAME_TOP_BAR_RIGHT_SPACE),
      -ABACUS_FRAME_TOP_BAR_HEIGHT
    );

    this.topBar = topBar;
  }

  private createTopBarText() {
    const topBarText = new Text()
      .addTo(this.drawing).text('9999');

    topBarText.attr({
      fill: "rgb(255, 255, 255)",
    }).font({size: "3em"});

    topBarText.center(
      (this.topBar.width() as number) / 2,
      (this.topBar.height() as number) / 2
    );

    this.topBarText = topBarText;
  }

  public draw() {
    this.add(this.topBar);
    this.add(this.topBarText);
  }
}

export class AbacusFrame extends G implements Drawable {
  private frame!: Rect;
  private topBar!: AbacusFrameTopBar;
  private horizontalLine = new Line();

  constructor(private drawing: Svg) {
    super();
    this.createFrame();
    this.createTopBar()
  };

  private createFrame() {
    const frame = new Rect({
      width: ABACUS_FRAME_WIDTH,
      height: ABACUS_FRAME_HEIGHT
    }).addTo(this.drawing);

    frame.attr({
      stroke: ABACUS_FRAME_COLOR,
      fill: ABACUS_FRAME_FILL,
      "stroke-width": ABACUS_FRAME_STROKE_WIDTH,
      rx: "5",
      ry: "5"
    });

    this.frame = frame;
  }

  private createTopBar() {
    const topBar = new AbacusFrameTopBar(this.drawing);
    this.topBar = topBar;
  }

  public draw() {
    this.topBar.draw();
    this.add(this.frame);
    this.add(this.topBar);
  }
}
