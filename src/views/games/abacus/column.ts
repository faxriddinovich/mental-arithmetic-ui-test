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

const kmap = {
  0: 0b010001111,
  1: 0b010010011,
  2: 0b010011011,
  3: 0b010011101,
  4: 0b010011110,
  5: 0b101001111,
  6: 0b001010111,
  7: 0b001011011,
  8: 0b001011101,
  9: 0b001011110,
};

export class AbacusColumn extends G implements Drawable {
  private locked = false;
  private stones: Map<number, AbacusStone> = new Map();
  private verticalLine = new Line();

  private bin = kmap[0];

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

    const k = kmap[0];

    for(let i = 0; i < k.length; i++) {
      if (k[i] == 1) {
        const abacusStone = new AbacusStone();
      } else if (i == 2 && k[i] == 0) { // always 0

      }
    }

    for (let i = 0; i < ABACUS_STONE_SLOTS_COUNT; i++) {
      if (i == 1 || i == 2) continue;
      abacusStone.isHigh = i == 0;
      abacusStone.draw();
      abacusStone.on("click", () => this.updateStone(i));

      abacusStone.y(
        ABACUS_STONE_HEIGHT * i + (i > 1 ? ABACUS_HORIZONTAL_LINE_WIDTH : 0)
      );
      this.add(abacusStone);
      this.stones.set(i, abacusStone);
    }
  }
}

export class AbacusColumns extends G implements Drawable {
  constructor(private columns: number) {
    super();
    let i = 100;
    /*
    setInterval(() => {
      this.display(i++);
    }, 500);
    */
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
