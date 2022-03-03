import { Example } from '@/store/example';

export interface SequenceItem {
  theme: string;
  examples: Example[];
  examplesTimeout: number;
  rowsTimeout: number;
  displayNumbers: boolean;
  fontRotation: number;
  fontColor: string;
  fontSize: number;
  speechSound: boolean;
  examplesCount: number;
  rowsCount: number;
  digit: number;
}

export interface AbacusGameConfig {
  sequence: SequenceItem[],
  timerSecs: number,
  waitForAnswer: boolean,
  abacusColumnsCount: number,
}

export interface Drawable {
  draw(): void;
}

export interface UpdateEventDetail {
  index: number;
  value: number;
}
