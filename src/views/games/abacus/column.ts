import {G, Line} from '@svgdotjs/svg.js';
import { Drawable } from './interfaces';
import { AbacusStone } from './stone';
import { ABACUS_STONE_WIDTH, ABACUS_STONE_HEIGHT, ABACUS_HORIZONTAL_LINE_WIDTH, ABACUS_STONE_SLOTS_COUNT, ABACUS_COLUMN_VERTICAL_LINE_WIDTH, ABACUS_COLUMN_VERTICAL_LINE_COLOR } from './constants';

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

  public reset() {
    for(const [, stone] of this.stones)
      stone.inactivate();
  }

  public draw() {
    this.verticalLine
      .attr({
        x1: ABACUS_STONE_WIDTH / 2,
        y1: 0,
        x2: ABACUS_STONE_WIDTH / 2,
        y2: ABACUS_STONE_HEIGHT * ABACUS_STONE_SLOTS_COUNT + ABACUS_HORIZONTAL_LINE_WIDTH
      }).stroke({
        width: ABACUS_COLUMN_VERTICAL_LINE_WIDTH,
        color: ABACUS_COLUMN_VERTICAL_LINE_COLOR
      })

    this.add(this.verticalLine);
    for (let i = 0, j = 0; i < ABACUS_STONE_SLOTS_COUNT; i++) {
      if (i == 1 || i == 2) continue;
      const abacusStone = new AbacusStone();
      abacusStone.isHighStone = i == 0;
      abacusStone.value = i == 0 ? 5 : j;
      abacusStone.draw();

      abacusStone.on('click', () => this.updateStone(i));

      const currentPosition = ABACUS_STONE_HEIGHT * i + (i > 1 ? ABACUS_HORIZONTAL_LINE_WIDTH : 0);;

      abacusStone.y(currentPosition);
      this.add(abacusStone);
      this.stones.set(i, abacusStone);
      j++;
    }
  }
}

export class AbacusColumns extends G implements Drawable {
  constructor(private columns: number) {super()};

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

  public reset() {
    for(const column of this.children())
      (column as AbacusColumn).reset();
  }
}
