import {defineStore} from "pinia";
import {Column, GeneratedRow, Theme, themes} from "@mental-arithmetic/themes";

export interface Example {
    numbers: (string | number | BigInt)[];
    answer: number | BigInt;
    answerMap: (number | BigInt)[]
    rows: GeneratedRow[]
}

export const acquireExample = defineStore("Example", {

    actions: {
        gen(
            theme: string,
            examplesCount: number,
            rowsCount: number,
            digit: number
        ): Example[] {
            // const target = themes.find((_theme) => _theme.loc === theme);
            // if (!target) return [];
            // const examples: Example[] = [];
            //
            // for (let i = 0; i < examplesCount; i++)
            //     examples.push(target.generate(rowsCount, digit));
            //
            // return examples;
            const target: Theme | undefined = themes.find((_theme) => _theme.loc === theme);
            if (!target) {
                return [];
            }

            const examples: Example[] = [];

            for (let i = 0; i < examplesCount; i++) {
                const column: Column = target.generate(rowsCount, digit);

                const example: Example = {
                    numbers: column.rows.map(([_, v]) => {
                        const n = Number(v);
                        return Number.isSafeInteger(n) ? n : BigInt(v);
                    }),
                    answer: (() => {
                        const n = Number(column.answer);
                        return Number.isSafeInteger(n) ? n : BigInt(column.answer);
                    })(),
                    answerMap: column.answers.map(ans => {
                        const n = Number(ans);
                        return Number.isSafeInteger(n) ? n : BigInt(ans);
                    }),
                    rows: column.rows
                };

                examples.push(example);
            }

            return examples;
        },
    },
});
