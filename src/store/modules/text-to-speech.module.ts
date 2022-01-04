import { ActionContext } from 'vuex';
import {TextToSpeech} from '@capacitor-community/text-to-speech';

interface StateProps {
  language: string,
  voiceIndex: number;
}

const toBCP47Identifier = (locale: string) => {
  switch (locale) {
    case 'en':
      return 'en-US'
    case 'ru':
      return 'ru-RU'
    case 'uz':
      return 'en-US'
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

export default {
  namespaced: true,
  state: {
    language: 'en_US',
    voiceIndex: 0,
  },
  getters: {
    get(state: StateProps) {
      return state;
    }
  },
  actions: {
    async updateLanguage(context: ActionContext<StateProps, any>, language: string) {
      const lang = await getLanguage(language);
      const voiceIndex = await getVoiceIndex(language);
      context.state.language = lang;
      context.state.voiceIndex = voiceIndex;
    }
  }
};
