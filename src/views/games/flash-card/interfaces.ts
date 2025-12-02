import { Theme } from "@mental-arithmetic/themes";

export enum FlashCardGameMode {
  abacus,
  numbers,
}

export interface FlashCardThemeConfig {
  theme: Theme;
  digits: number;
  examplesCount: number;
  rowsCount: number;
  examplesTimeout: number;
  rowsTimeout: number;
  fontColor: string;
  mode: FlashCardGameMode;
  speechSound: boolean,
}

export interface FlashCardGameConfig {
  themes: FlashCardThemeConfig[],
  timerMins: number,
  timerSecs: number
}
