import { TextToSpeech as NativeTextToSpeech } from "@capacitor-community/text-to-speech";
import Crunker from "crunker";
import { Operation } from '@mental-arithmetic/themes';

const GET_VOICES_MAX_TRIES_COUNT = 100;

/*
 * +32
 * -32
 * *32
 * /324
 *
 * 32 / 24
 *
 */

export class TextToSpeech {
  private static crunker = new Crunker();
  public static additionalLanguages = [
    "com.mental.speech.synthesis.voice.Uzbek:Uzbek voice:uz-UZ:1",
  ];

  private static signMap: { [key: number]: string } = {
    [Operation.add]: "added_by",
    [Operation.sub]: "subtracted_by",
    [Operation.mult]: "multiplied_by",
    [Operation.div]: "divided_by",
  };

  public static getSign(n: string): Operation {
    return n[0] == '-' ? Operation.sub : Operation.add;
  }

  public static speak(
    identifier: string,
    row: string | string[],
    op: Operation
  ): Promise<void> {
    const [, , locale] = identifier.split(":");
    if (locale == "uz-UZ") {
      const signChunk = this.load(this.signMap[op]);
      const chunks =
        row instanceof Array
          ? [...this.toChunk(row[0]), signChunk, ...this.toChunk(row[1])]
          : [signChunk, ...this.toChunk(row)];
          console.log(chunks);
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
          audio.playbackRate = 2.0;
          audio.play();
        });
    }

    if (row instanceof Array) {
      [32, 25]; // *
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

  public static split(n: number): number[] {
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

  public static group(n: number): number[] {
    let str = n.toString();
    const len = str.length;
    if (n % 10 ** (len - 1) == 0) return [n];

    const mod = len % 3;
    str = str.padStart(mod % 3 != 0 ? len + (3 - mod) : len, "0");

    return str.split("").reduce((acc, _1, _2, src) => {
      acc.push(parseInt(src.splice(0, 3).join(""))) && acc;
      return acc;
    }, [] as number[]);
  }

  public static load(k: any) {
    return require("@@/sounds/tts/" + k + ".mp3");
  }

  public static toChunk(n: string): string[] {
    const gr = this.group(parseInt(n));

    const chunks = gr
      .reduce((acc, curr, cind, src) => {
        const chunks = this.split(curr);
        acc.push(...chunks);
        if (src[cind + 1]) acc.push(1000 ** (src.length - cind - 1));
        return acc;
      }, [] as number[])
      .map((n) => this.load(n));

    //if (sign) chunks.unshift(this.load(signMap.get(sign)));

    return chunks;

    const crunker = new Crunker();
    crunker
      .fetchAudio(...chunks)
      .then((k) => {
        return crunker.concatAudio(k);
      })
      .then((merged) => {
        return crunker.export(merged, "audio/mp3");
      })
      .then((out) => {
        const audio = new Audio(out.url);
        audio.playbackRate = 2.0;
        audio.play();
      });
  }
}

/*
export function speak(text: string | number, rate: number, identity: string) {
  const [, , lang, index] = identity.split(":");

  return;
  TextToSpeech.speak({
    text: String(text),
    voice: Number(index),
    pitch: 0.5,
    lang,
    rate,
  }).catch((error) => {
    console.error("[tts]: ", error);
  });
}
*/
