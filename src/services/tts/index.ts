import {TextToSpeech} from '@capacitor-community/text-to-speech';
import Store from '@/store';

export function speak(text: string | number, lang: string, rate: number) {
  const { language, voiceIndex } = Store.getters['TextToSpeech/get'];

  TextToSpeech.speak({
    text: String(text),
    lang: language,
    pitch: 0.5,
    rate,
    voice: voiceIndex
  }).catch((error) => {
    console.error('[tts]: ', error);
  });
}
