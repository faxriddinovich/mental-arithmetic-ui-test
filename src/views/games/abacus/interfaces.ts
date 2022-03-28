import { Theme } from '@mental-arithmetic/themes';
import { Example } from '@/store/example';

export interface SequenceItem {
  theme: Theme;
  examples: Example[];
  digit: number;
  rowsCount: number;
  examplesCount: number;
  abacusColumnsCount: number,
  examplesTimeout: number;
  rowsTimeout: number;
  displayNumbers: boolean;
  fontRotation: number;
  fontColor: string;
  fontSize: number;
  speechSound: boolean;
}

export interface AbacusGameConfig {
  sequence: SequenceItem[],
  timerSecs: number,
  waitForAnswer: boolean,
}

export interface Drawable {
  draw(): void;
}

export interface UpdateEventDetail {
  index: number;
  value: number;
}
