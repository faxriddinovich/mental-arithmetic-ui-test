export interface Example {
  numbers: (string | number)[];
  answer: number;
}

export interface QueueItem {
  theme: string;
  examples: Example[];
  examplesTimeout: number;
  rowsTimeout: number;
  hasSound: boolean;
  displayNumbers: boolean;
  fontRotation: number;
  fontColor: string;
  fontSize: number;
}

export interface BigNumbersGameSettings {
  answerAtEnd: boolean;
  multiplayerMode: boolean,
  sameExamples: boolean,
  queue: QueueItem[];
}
