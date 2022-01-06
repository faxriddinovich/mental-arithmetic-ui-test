import {ActionContext} from 'vuex';
import {TextToSpeech, SpeechSynthesisVoice} from '@capacitor-community/text-to-speech';

export interface IdentifiedVoice extends SpeechSynthesisVoice {
  identify: string,
}

interface StateProps {
  language: string,
  voiceIndex: number;
}

export const buildVoiceIdentity = (uri: string, locale: string) => uri + ':' + locale;

const identify = (voices: SpeechSynthesisVoice[]): IdentifiedVoice[] => {
  return voices.map((voice) => {
    console.log({ ...Object.assign({}, voice) });
    return {
      ...voice,
      identify: voice.voiceURI + ':' + voice.lang
    }
  });
}

export function lookForVoiceIndex(
  voices: IdentifiedVoice[],
  identity: string
): number | null {
  let i = 0;
  for (const voice of voices) {
    if (voice.identify === identity) {
      return i;
    } else i++;
  }

  return null;
}

export default {
  namespaced: true,
  getters: {
    get(state: StateProps) {
      return state;
    }
  },
  actions: {
    async update(context: ActionContext<StateProps, any>, identify: string) {
      const [uri, locale] = identify.split(':');
      const voices = await context.dispatch('getSupportedVoices');
      const ttsVoiceIndex = lookForVoiceIndex(voices, identify);
      return context.dispatch('Settings/update', {ttsVoiceIndex}, {root: true});
    },

    async getSupportedVoices() {
      return new Promise((resolve) => {
        // getting voices is asynchronous thing
        const timerHandle = setInterval(async () => {
          const {voices} = await TextToSpeech.getSupportedVoices();
          if (voices.length) {
            clearInterval(timerHandle);
            resolve(identify(voices));
          }
        }, 10);
      });
    }
  }
};
