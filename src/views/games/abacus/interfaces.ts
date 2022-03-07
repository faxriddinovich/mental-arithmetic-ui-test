import { Example } from '@/store/example';

export interface SequenceItem {
  theme: string;
  examples: Example[];
  digit: number;
  rowsCount: number;
  examplesCount: number;
}

export interface AbacusGameConfig {
  sequence: SequenceItem[],
  timerSecs: number,
  waitForAnswer: boolean,
  abacusColumnsCount: number,
  examplesTimeout: number;
  rowsTimeout: number;
  displayNumbers: boolean;
  fontRotation: number;
  fontColor: string;
  fontSize: number;
  speechSound: boolean;
}

export interface Drawable {
  draw(): void;
}

export interface UpdateEventDetail {
  index: number;
  value: number;
}
