import { Theme, Example } from '@mental-arithmetic/themes';

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
  digit: number;
  value: number;
}
