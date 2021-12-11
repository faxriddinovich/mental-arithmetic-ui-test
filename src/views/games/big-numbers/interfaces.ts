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

export interface NumbersGameSettings {
  answerAtEnd: boolean;
  multiplayerMode: boolean,
  queue: QueueItem[];
}
