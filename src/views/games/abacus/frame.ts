import { G, Image, Line } from '@svgdotjs/svg.js';

class AbacusColumn extends G {
  private stones: Image[] = [];
  private bitset = 0b00000;
  private verticalLine = new Line();

  constructor() {
    super();
  }

  private drawVerticalLine() {
    const xPos = ABACUS_STONE_WIDTH / 2;
    this.verticalLine
      .attr({
        x1: xPos,
        x2: xPos,
        y1: 0,
        y2: ABACUS_FRAME_HEIGHT,
      })
      .stroke({ width: 20, color: ABACUS_FRAME_HORIZONTAL_LINE_COLOR });
    this.add(this.verticalLine);
  }

  private createStones(drawing: Svg) {
    for (let i = 0; i < 8; i++) {
      if (i == 2 || i == 1 || i == 3) continue;
      const stoneImage = new Image()
        .load(stone)
        .addTo(drawing)
        .size(ABACUS_STONE_WIDTH, ABACUS_STONE_HEIGHT);

      const startX = ABACUS_FRAME_STROKE_WIDTH / 2 + 5;
      stoneImage.y(startX + (ABACUS_STONE_HEIGHT + 5) * i);

      this.stones.push(stoneImage);
      this.add(stoneImage);
    }
  }

  public draw(drawing: Svg) {
    this.drawVerticalLine();
    this.createStones(drawing);

    //this.move(ABACUS_FRAME_STROKE_WIDTH / 2 + 15, 0);
  }
}
