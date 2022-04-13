import { G, Line, List } from "@svgdotjs/svg.js";
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
  0b01001111: 0,
  0b01010111: 1,
  0b01011011: 2,
  0b01011101: 3,
  0b01011110: 4,
  0b10101111: 5,
  0b00110111: 6,
  0b00111011: 7,
  0b00111101: 8,
  0b00111110: 9,
};

export class AbacusColumn extends G implements Drawable {
  private locked = false;
  private stones: Map<number, AbacusStone> = new Map();
  private verticalLine = new Line();

  private bin = 0b010001111;
  public get value() {
    return kmap[this.bin];
  }

  constructor() {
    super();
  }

  public display(initial: number) {
    const map: { [key: number]: number[] } = {
      0: [],
      1: [3],
      2: [4],
      3: [5],
      4: [6],
      5: [0],
      6: [0, 3],
      7: [0, 4],
      8: [0, 5],
      9: [0, 6],
    };

    const kmap = map[initial];

    kmap.forEach((el) => {
      this.updateStone(el);
    });
  }

  public lock() {
    this.locked = true;
  }

  public unlock() {
    this.locked = false;
  }

  public toslot(stone: AbacusStone, slot: number): void {
    if (slot > 7 - 1 || stone.slot === slot) return;
    const move = stone.slot > slot ? stone.slot - slot : slot - stone.slot;

    const dy =
      (slot > stone.slot ? 1 : -1) *
      (move * ABACUS_STONE_HEIGHT +
        ((stone.slot <= 1 && slot > 1) || (stone.slot >= 2 && slot < 2)
          ? ABACUS_HORIZONTAL_LINE_WIDTH
          : 0));

    stone.animate(100).dy(dy);
    stone.slot = slot;
  }

  public update(k: number): void {
    const bin = parseInt(
      Object.keys(kmap).find((kk) => kmap[parseInt(kk)] == (k | 0) % 10)!
    );
    const weight = bin & 0b10000000 ? 5 : 1;
    const map = bin & 0b1111111;

    let stones = 0;

    /*
    setInterval(() => {
      this.toslot(this.stones.get(0)!, stones++);
    }, 1000);
    return;
    */

    for (let i = 0; i < 7; i++) {
      const stone = this.stones.get(stones);
      if (!stone) continue;

      if (map & (1 << (6 - i))) {
        if (stone.slot == i) {
          stones++;
          continue;
        }

        this.toslot(stone, i);
        stones++;
      } else if (stone.slot == i) {
        /*
        const lowstones = Array.from(this.stones).filter(([, _stone]) => {
          return stone.slot >= _stone.slot;
        }).map(([, stone]) => stone);

        for(const stone of lowstones) {
          this.toslot(stone, stone.slot - 1);
        }
        */
      }
    }

    this.bin = bin;
    this.dispatch("update", { value: this.value });
  }

  public updateStone(stoneIndex: number) {
    if (this.locked) return;

    const stone = this.stones.get(stoneIndex)!;
    if (stone.isHigh) {
      if (stone.isActive) {
        stone.inactivate();
        this.value -= 5;
      } else {
        stone.activate();
        this.value += 5;
      }
    } else {
      const lowStones = Array.from(this.stones).filter(([index, _stone]) => {
        return (
          !_stone.isHigh &&
          (_stone.isActive ? stoneIndex < index : stoneIndex >= index)
        );
      });

      lowStones.forEach(([_, _stone]) => {
        if (_stone.isActive) {
          _stone.inactivate();
          this.value--;
        } else {
          _stone.activate();
          this.value++;
        }
      });
    }
    this.dispatch("update", { value: this.value });
    return;
  }

  public reset() {
    this.value = 0;
    for (const [, stone] of this.stones) stone.inactivate();
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
      abacusStone.isHigh = i == 0;
      abacusStone.slot = i;
      abacusStone.draw();
      abacusStone.on("click", () => this.updateStone(i));

      abacusStone.y(
        ABACUS_STONE_HEIGHT * i + (i > 1 ? ABACUS_HORIZONTAL_LINE_WIDTH : 0)
      );
      this.add(abacusStone);
      this.stones.set(stones++, abacusStone);
    }
  }
}
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class AbacusColumns extends G implements Drawable {
  constructor(private columns: number) {
    super();
  }

  public display(n: number) {
    const str = n.toString();

    this.children().forEach((el, idx) => {
      (el as AbacusColumn).display(parseInt(str[idx]));
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

    setInterval(() => {
      const str = getRandomInt(10000, 99999).toString();
      for(let i = 0 ;i < str.length; i++) {
        this.children()[i].update(parseInt(str[i]));
      }
    }, 1000);
  }

  public setColumns(columns: number) {
    this.columns = columns;
  }

  public lock() {
    for (const stone of this.children()) stone.lock();
  }

  public unlock() {
    for (const stone of this.children()) stone.unlock();
  }

  public reset() {
    for (const column of this.children()) (column as AbacusColumn).reset();
  }
}
