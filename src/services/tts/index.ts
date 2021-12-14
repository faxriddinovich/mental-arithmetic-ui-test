import {TextToSpeech} from '@capacitor-community/text-to-speech';

const toBCP47Identifier = (locale: string) => {
  switch (locale) {
    case 'en':
      return 'en-US'
    case 'ru':
      return 'ru-RU'
    case 'uz':
      return 'en-US' // FIXME
    default:
      return 'en-US'
  }
}

async function getLanguage(lang: string): Promise<string> {
  const {languages} = await TextToSpeech.getSupportedLanguages();
  const language = languages.find((language) => language === toBCP47Identifier(lang));
  return language || languages[0];
}

async function getVoiceIndex(lang: string): Promise<number> {
  const {voices} = await TextToSpeech.getSupportedVoices();

  for (let i = 0; i < voices.length; i++) {
    if (voices[i].lang === toBCP47Identifier(lang)) {
      return i;
    }
  }

  return 0;
}

export async function speak(text: string | number, lang: string, speed: number) {
  const voiceIndex = await getVoiceIndex(lang);
  const language = await getLanguage(lang);

  TextToSpeech.speak({
    text: String(text),
    lang: language,
    voice: voiceIndex
  }).catch(() => {
    console.error('[tts]: tts error raised');
  });
}
