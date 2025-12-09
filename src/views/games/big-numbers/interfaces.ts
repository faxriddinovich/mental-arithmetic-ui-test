import { Example } from '@/store/example';
import {Theme} from "@mental-arithmetic/themes";

export interface SequenceItem {
  theme: Theme;
  examples: Example[];
  examplesTimeout: number;
  rowsTimeout: number;
  displayNumbers: boolean;
  fontRotation: number;
  fontColor: string;
  speechSound: boolean;
  fontSize: number;
  examplesCount: number;
  rowsCount: number;
  digit: number;
}

export interface InstanceItem {
  answerAtEnd: boolean,
  sequence: SequenceItem[]
}

export interface BigNumbersGameConfig  {
  answerAtEnd: boolean,
  multiplayerMode: boolean,
  sameExamples: boolean,
  instances: InstanceItem[]
}
