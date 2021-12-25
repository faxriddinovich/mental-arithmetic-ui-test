export interface Example {
  numbers: (string | number)[];
  answer: number;
}

export interface SequenceItem {
  theme: string;
  examples: Example[];
  examplesTimeout: number;
  rowsTimeout: number;
  displayNumbers: boolean;
  fontRotation: number;
  fontColor: string;
  speechSound: boolean;
  fontSize: number;
}

export interface InstanceItem {
  answerAtEnd: boolean,
  sequence: SequenceItem[]
}
