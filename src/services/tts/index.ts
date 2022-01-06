import {TextToSpeech} from '@capacitor-community/text-to-speech';
import Store from '@/store';

export function speak(text: string | number, rate: number) {
  const { ttsVoiceIndex, locale } = Store.getters['Settings/all'];

  TextToSpeech.speak({
    text: String(text),
    lang: locale,
    voice: ttsVoiceIndex,
    pitch: 0.5,
    rate
  }).catch((error) => {
    console.error('[tts]: ', error);
  });
}
