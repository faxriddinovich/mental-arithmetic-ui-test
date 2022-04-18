import { G, Line } from "@svgdotjs/svg.js";
import { Drawable, UpdateEventDetail } from "./interfaces";
import { AbacusStone } from "./stone";
import {
  ABACUS_STONE_WIDTH,
  ABACUS_STONE_HEIGHT,
  ABACUS_HORIZONTAL_LINE_WIDTH,
  ABACUS_STONE_SLOTS_COUNT,
  ABACUS_COLUMN_VERTICAL_LINE_WIDTH,
  ABACUS_COLUMN_VERTICAL_LINE_COLOR,
} from "./constants";

const kmap: { [key: number]: number } = {
  0b1001111: 0,
  0b1010111: 1,
  0b1011011: 2,
  0b1011101: 3,
  0b1011110: 4,
  0b0101111: 5,
  0b0110111: 6,
  0b0111011: 7,
  0b0111101: 8,
  0b0111110: 9,
};

export class AbacusColumn extends G implements Drawable {
  private locked = false;
  private stones: Map<number, AbacusStone> = new Map();
  private verticalLine = new Line();

  public bin = 0b1001111;

  public value = 0;

  constructor() {
    super();
  }

  public lock() {
    this.locked = true;
  }

  public unlock() {
    this.locked = false;
  }

  public toslot(stone: AbacusStone, slot: number, duration = 100): void {
    if (slot > 7 - 1 || stone.kslot === slot) return;
    const move = stone.kslot > slot ? stone.kslot - slot : slot - stone.kslot;

    const dy =
      (slot > stone.kslot ? 1 : -1) *
      (move * ABACUS_STONE_HEIGHT +
        ((stone.kslot <= 1 && slot > 1) || (stone.kslot >= 2 && slot < 2)
          ? ABACUS_HORIZONTAL_LINE_WIDTH
          : 0));

    stone.animate(duration).dy(dy);
    stone.kslot = slot;
  }

  public update(k: number): void {
    const bin = parseInt(
      Object.keys(kmap).find((kk) => kmap[parseInt(kk)] == (k | 0) % 10)!
    );

    let stones = 0;

    for (let i = 0; i < 7; i++) {
      const stone = this.stones.get(stones);
      if (!stone) continue;

      if (bin & (1 << (6 - i))) {
        if (stone.kslot == i) {
          stones++;
          continue;
        }

        this.toslot(stone, i);
        stones++;
      }
    }

    this.value = k;
    this.fire("update", { value: this.value });
  }

  private drawBin() {
    let bin = 0;
    for (const [, stone] of this.stones) {
      bin = bin | (1 << (6 - stone.kslot));
    }
    this.bin = bin;
  }

  public smove(stoneIndex: number): void {
    if (this.locked) return;

    const stone = this.stones.get(stoneIndex)!;
    let kvalue = this.value;

    if (stone.isHigh) {
      if (stone.isActive) {
        kvalue -= 5;
        this.toslot(stone, 0);
      } else {
        kvalue += 5;
        this.toslot(stone, 1);
      }
    } else {
      const stones = Array.from(this.stones).filter(([, _stone]) => {
        if (_stone.isHigh) return false;

        return _stone.isActive
          ? stone.kslot <= _stone.kslot
          : stone.kslot >= _stone.kslot;
      });

      for (const [, stone] of stones) {
        if (stone.isActive) {
          this.toslot(stone, stone.kslot + 1);
          kvalue--;
        } else {
          this.toslot(stone, stone.kslot - 1);
          kvalue++;
        }
      }
    }

    this.value = kvalue;
    this.fire("update", { value: this.value });
    this.drawBin();
  }

  public reset() {
    this.update(0);
  }

  public draw() {
    this.verticalLine
      .attr({
        x1: ABACUS_STONE_WIDTH / 2,
        y1: 0,
        x2: ABACUS_STONE_WIDTH / 2,
        y2:
          ABACUS_STONE_HEIGHT * ABACUS_STONE_SLOTS_COUNT +
          ABACUS_HORIZONTAL_LINE_WIDTH,
      })
      .stroke({
        width: ABACUS_COLUMN_VERTICAL_LINE_WIDTH,
        color: ABACUS_COLUMN_VERTICAL_LINE_COLOR,
      });

    this.add(this.verticalLine);

    let stones = 0;

    for (let i = 0; i < 7; i++) {
      if (i == 1 || i == 2) continue;
      const abacusStone = new AbacusStone();
      abacusStone.kslot = 0;
      abacusStone.draw();
      abacusStone.kindex = stones;
      abacusStone.on("click", () => this.smove(abacusStone.kindex));

      this.add(abacusStone);
      this.toslot(abacusStone, i, 1);
      this.stones.set(stones++, abacusStone);
    }
  }
}

export class AbacusColumns extends G implements Drawable {
  constructor(private columns: number) {
    super();
  }

  public display(n: number) {
    const str = n.toString();

    this.children().forEach((el, idx) => {
      (el as AbacusColumn).smove(parseInt(str[idx]));
    });
  }

  public draw() {
    for (let i = 0; i < this.columns; i++) {
      const column = new AbacusColumn();
      column.draw();
      column.on("update", (value) => {
        const detail = (value as CustomEvent<UpdateEventDetail>).detail;
        this.fire("update", [i, detail.value]);
      });
      column.x(ABACUS_STONE_WIDTH * i);
      this.add(column);
    }
  }

  public setColumns(columns: number) {
    this.columns = columns;
  }

  public lock() {
    for (const column of this.children()) (column as AbacusColumn).lock();
  }

  public unlock() {
    for (const column of this.children()) (column as AbacusColumn).unlock();
  }

  public reset() {
    for (const column of this.children()) (column as AbacusColumn).reset();
  }
}
