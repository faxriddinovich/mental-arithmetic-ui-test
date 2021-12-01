export interface Example {
  numbers: (string | number)[],
  answer: number
}

export interface QueueItem {
  theme: string,
  examples: Example[],
  hasSound: boolean,
  displayNumbers: boolean,
  fontRotation: number,
  fontColor: string,
  fontSize: number,
}

export interface NumbersGameSettings {
  answerAtEnd: boolean,
  queue: QueueItem[]
}
