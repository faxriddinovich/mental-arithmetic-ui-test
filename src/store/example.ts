import { defineStore } from "pinia";
import { themes } from "@mental-arithmetic/themes";

export interface Example {
  numbers: (string | number | BigInt)[];
  answer: BigInt | number;
}

export const acquireExample = defineStore({
  id: "Example",
  actions: {
    gen(
      theme: string,
      examplesCount: number,
      rowsCount: number,
      digit: number
    ): Example[] {
      const target = themes.find((_theme) => _theme.loc === theme);
      if (!target) return [];
      const examples: Example[] = [];

      for (let i = 0; i < examplesCount; i++)
        examples.push(target.generate(rowsCount, digit));

      return examples;
    },
  },
});
