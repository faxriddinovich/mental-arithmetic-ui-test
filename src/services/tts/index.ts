import {TextToSpeech} from '@capacitor-community/text-to-speech';

export function speak(text: string | number, rate: number, identity: string) {
  const [,lang, index] = identity.split(':');

  TextToSpeech.speak({
    text: String(text),
    voice: Number(index),
    pitch: 0.5,
    lang,
    rate
  }).catch((error) => {
    console.error('[tts]: ', error);
  });
}
