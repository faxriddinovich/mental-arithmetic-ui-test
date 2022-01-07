import {ActionContext} from 'vuex';
import {TextToSpeech, SpeechSynthesisVoice} from '@capacitor-community/text-to-speech';

export interface IdentifiedVoice extends SpeechSynthesisVoice {
  identity: string,
}

interface StateProps {
  language: string,
  voiceIndex: number;
}

const identify = (voices: SpeechSynthesisVoice[]): IdentifiedVoice[] => {
  return voices.map((voice, index) => {
    // TODO: do not copy the object like this
    const copy = {
      default: voice.default,
      lang: voice.lang,
      localService: voice.localService,
      name: voice.name,
      voiceURI: voice.voiceURI
    }

    const identity = {identity: voice.voiceURI + ':' + voice.lang + ':' + index};
    return Object.assign(copy, identity);
  });
}

export default {
  namespaced: true,
  actions: {
    async sync(context: ActionContext<StateProps, any>) {
      const { ttsVoiceIdentity, locale } = context.rootGetters['Settings/all'];
      if (! ttsVoiceIdentity) {
        const supportedVoices = await context.dispatch('getSupportedVoicesByLocale', locale);
        if (supportedVoices.length) {
          return context.dispatch('Settings/update', {
            ttsVoiceIdentity: supportedVoices[0].identity
          }, {root: true});
        }
      }
    },

    update(context: ActionContext<StateProps, any>, identity: string) {
      return context.dispatch('Settings/update', {
        ttsVoiceIdentity: identity
      }, {root: true});
    },

    async getSupportedVoicesByLocale(context: ActionContext<StateProps, any>, locale: string) {
      return new Promise((resolve) => {
        // getting voices is asynchronous thing
        const timerHandle = setInterval(async () => {
          const {voices} = await TextToSpeech.getSupportedVoices();
          if (voices.length) {
            clearInterval(timerHandle);
            const filtered = identify(voices).filter((voice) => {
              return voice.lang.replace('_', '-') === locale;
            });
            resolve(filtered);
          }
        }, 10);
      });
    }
  }
};
