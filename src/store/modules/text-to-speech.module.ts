import { ActionContext } from 'vuex';
import {TextToSpeech, SpeechSynthesisVoice} from '@capacitor-community/text-to-speech';

interface StateProps {
  language: string,
  voiceIndex: number;
}

function lookForVoiceIndex(
  voices: SpeechSynthesisVoice[],
  language: string
): number {
  let index = 0;
  voices.map((voice, voiceIndex) => {
    if(voice.lang === language) index = voiceIndex;
  });
  return index;
}

export default {
  namespaced: true,
  state: {
    language: 'en-US',
    voiceIndex: 0,
  },
  getters: {
    get(state: StateProps) {
      return state;
    }
  },
  actions: {
    async update(context: ActionContext<StateProps, any>, language: string) {
      return new Promise<void>((resolve) => {
        const timerHandle = setInterval(async () => {
          const { voices } = await TextToSpeech.getSupportedVoices();
          if(voices.length !== 0) {
            context.state.language = language;
            context.state.voiceIndex = lookForVoiceIndex(voices, language);
            clearInterval(timerHandle);
            resolve();
          }
        }, 10);
      });
    }
  }
};
