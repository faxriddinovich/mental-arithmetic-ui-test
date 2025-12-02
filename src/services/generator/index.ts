import { themes } from "@mental-arithmetic/themes";

export interface Example {
  numbers: (string | number)[];
  answer: number;
}

export const getThemes = () => themes;

export const generateExamples = (
  theme: string,
  examplesCount: number,
  rowsCount: number,
  digit: number
): Example[] => {
  const targetTheme = themes.find((t) => t.loc == theme);
  if (!theme) return [];

  const examples: Example[] = [];
  for (let i = 0; i < examplesCount; i++) {
    examples[i] = targetTheme?.generate(rowsCount, digit) as any as Example; // FIXME
  }

  return examples;
};
