import { TextToSpeech as NativeTextToSpeech } from "@capacitor-community/text-to-speech";
import Crunker from "crunker";
import { Operation, RowEl } from "@mental-arithmetic/themes";

const GET_VOICES_MAX_TRIES_COUNT = 100;

export class TextToSpeech {
  private static crunker = new Crunker();
  public static additionalLanguages = [
    "com.mental.speech.synthesis.voice.Uzbek:Uzbek voice:uz-UZ:1",
  ];

 /* these should not be here */
  private static signMap = {
    "en-US": {
      [Operation.add]: "added to",
      [Operation.sub]: "subtracted from",
      [Operation.mult]: "multiplied by",
      [Operation.div]: "divided by",
    },
    "ru-RU": {
      [Operation.add]: "добавлено к",
      [Operation.sub]: "вычесть из",
      [Operation.mult]: "умножено на",
      [Operation.div]: "разделить на",
    },
    /* FIXME: fix typos */
    "uz-UZ": {
      [Operation.add]: "added_by",
      [Operation.sub]: "subtracted_by",
      [Operation.mult]: "multiplied_by",
      [Operation.div]: "divided_by",
    },
  };

  public static getSign(n: string): Operation {
    return n[0] == "-" ? Operation.sub : Operation.add;
  }

  public static speak(identifier: string, row: RowEl): Promise<void> {
    const [, , locale, index] = identifier.split(":");
    if (locale == "uz-UZ") {
      const signChunk = this.load(this.signMap[locale][row.sign]);

      const chunks =
        row.numbers instanceof Array
          ? [
              ...this.toChunk(row.numbers[0]),
              signChunk,
              ...this.toChunk(row.numbers[1]),
            ]
          : [signChunk, ...this.toChunk(row.numbers)];

      this.crunker
        .fetchAudio(...chunks)
        .then((k) => {
          return this.crunker.concatAudio(k);
        })
        .then((merged) => {
          return this.crunker.export(merged, "audio/mp3");
        })
        .then((out) => {
          const audio = new Audio(out.url);
          audio.playbackRate = 5.0;
          audio.play();
        });
    } else {
      console.log(this.signMap[locale][row.sign]);
      const text =
        row.numbers instanceof Array
          ? row.numbers[0] + this.signMap[locale][row.sign] + row.numbers[1]
          : this.signMap[locale][row.sign] + row.numbers;
      NativeTextToSpeech.speak({
        text: text,
        voice: Number(index),
        lang: locale,
      });
    }

    return Promise.resolve();
  }

  public static getSupportedVoices(lang: string): Promise<string[]> {
    if (lang == "uz-UZ") return Promise.resolve(this.additionalLanguages);
    let triesCount = 0;
    return new Promise((resolve, reject) => {
      const timerHandle = setInterval(async () => {
        if (triesCount >= GET_VOICES_MAX_TRIES_COUNT) {
          clearInterval(timerHandle);
          return reject();
        }
        const supported = await NativeTextToSpeech.getSupportedVoices();
        if (supported.voices.length) {
          clearInterval(timerHandle);
          const identified = supported.voices
            .map((voice, index) => {
              return (
                voice.voiceURI +
                ":" +
                voice.name +
                ":" +
                voice.lang +
                ":" +
                index
              );
            })
            .filter((voice) => {
              const [, , llang] = voice.split(":");
              return lang && llang.replace("-", "_") == lang.replace("-", "_");
            });

          return resolve(identified);
        }
        triesCount++;
      }, 10);
    });
  }

  public static split(n: bigint): number[] {
    const chunks = n.toString().split("");
    let i = 0;

    const res = chunks
      .reduce((acc, curr) => {
        const ncurr = parseInt(curr);
        const power = 10 ** (chunks.length - i++ - 1);
        // FIXME: hard coded
        if (power > 99) {
          acc.push(ncurr, power);
        } else {
          acc.push(ncurr * power);
        }
        return acc;
      }, [] as number[])
      .filter((n) => n != 0);

    return res;
  }

  public static group(n: bigint): bigint[] {
    let str = n.toString();
    const len = str.length;
    if (n % BigInt(10) ** BigInt(len - 1) === BigInt(0)) return [n];

    const mod = len % 3;
    str = str.padStart(mod % 3 != 0 ? len + (3 - mod) : len, "0");

    return str.split("").reduce((acc, _1, _2, src) => {
      acc.push(BigInt(src.splice(0, 3).join(""))) && acc;
      return acc;
    }, [] as bigint[]);
  }

  public static load(k: any) {
    return require("@@/sounds/tts/" + k + ".mp3");
  }

  public static toChunk(n: bigint): string[] {
    const gr = this.group(n);

    const chunks = gr
      .reduce((acc, curr, cind, src) => {
        const chunks = this.split(curr);
        acc.push(...chunks);
        if (src[cind + 1]) acc.push(1000 ** (src.length - cind - 1));
        return acc;
      }, [] as number[])
      .map((n) => this.load(n));

    return chunks;
  }
}
