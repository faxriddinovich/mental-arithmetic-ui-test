import { TextToSpeech } from "@capacitor-community/text-to-speech";

const GET_VOICES_MAX_TRIES_COUNT = 100;

export function getVoices(locale?: string): Promise<string[]> {
  let triesCount = 0;
  return new Promise((resolve, reject) => {
    const timerHandle = setInterval(async () => {
      if (triesCount >= GET_VOICES_MAX_TRIES_COUNT) {
        clearInterval(timerHandle);
        return reject();
      }
      const supported = await TextToSpeech.getSupportedVoices();
      if (supported.voices.length) {
        clearInterval(timerHandle);
        const identified = supported.voices
          .map((voice, index) => {
            return (
              voice.voiceURI + ":" + voice.name + ":" + voice.lang + ":" + index
            );
          })
          .filter((voice) => {
            const [, , lang] = voice.split(":");
            return locale && lang.replace("-", "_") == locale.replace("-", "_");
          });
        return resolve(identified);
      }
      triesCount++;
    }, 10);
  });
}

export function speak(text: string | number, rate: number, identity: string) {
  const [, , lang, index] = identity.split(":");

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
