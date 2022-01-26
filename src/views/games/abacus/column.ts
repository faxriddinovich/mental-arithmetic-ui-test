import {G, Line} from '@svgdotjs/svg.js';
import {Drawable, UpdateEventDetail} from './interfaces';
import {AbacusStone} from './stone';
import {ABACUS_STONE_WIDTH, ABACUS_STONE_HEIGHT, ABACUS_HORIZONTAL_LINE_WIDTH, ABACUS_STONE_SLOTS_COUNT, ABACUS_COLUMN_VERTICAL_LINE_WIDTH, ABACUS_COLUMN_VERTICAL_LINE_COLOR} from './constants';

export class AbacusColumn extends G implements Drawable {
  private locked = false;
  private stones: Map<number, AbacusStone> = new Map();
  private value = 0;
  private verticalLine = new Line();

  public lock() {
    this.locked = true;
  }

  public unlock() {
    this.locked = false;
  }

  public updateStone(stoneIndex: number) {
    if (this.locked) return;

    const stone = this.stones.get(stoneIndex)!;
    if (stone.isHighStone) {
      if (stone.isActive) {
        stone.inactivate();
        this.value -= 5;
      } else {
        stone.activate()
        this.value += 5;
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
    this.value = 0;
    for (const [, stone] of this.stones)
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
    for (let i = 0; i < ABACUS_STONE_SLOTS_COUNT; i++) {
      if (i == 1 || i == 2) continue;
      const abacusStone = new AbacusStone();
      abacusStone.isHighStone = i == 0;
      abacusStone.draw();
      abacusStone.on('click', () => this.updateStone(i));

      abacusStone.y(ABACUS_STONE_HEIGHT * i + (i > 1 ? ABACUS_HORIZONTAL_LINE_WIDTH : 0));
      this.add(abacusStone);
      this.stones.set(i, abacusStone);
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
        const detail = (value as CustomEvent<UpdateEventDetail>).detail;
        this.fire('update', [i, detail.value]);
      });
      column.x(ABACUS_STONE_WIDTH * i);
      this.add(column);
    }
  }

  public lock() {
    for (const stone of this.children())
      stone.lock();
  }

  public unlock() {
    for (const stone of this.children())
      stone.unlock();
  }

  public reset() {
    for (const column of this.children())
      (column as AbacusColumn).reset();
  }
}
