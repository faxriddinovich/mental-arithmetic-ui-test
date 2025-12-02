import {ActionContext} from 'vuex';
import {TextToSpeech, SpeechSynthesisVoice} from '@capacitor-community/text-to-speech';

export interface IdentifiedVoice extends SpeechSynthesisVoice {
  identity: string,
}

interface StateProps {
  language: string,
  voiceIndex: number;
}

const GET_VOICES_MAX_TRIES_COUNT = 100;

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
      const {ttsVoiceIdentity, locale} = context.rootGetters['Settings/all'];
      if (!ttsVoiceIdentity) {
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
      let triesCount = 0;
      return new Promise((resolve, reject) => {
        // getting voices is asynchronous thing
        const timerHandle = setInterval(async () => {

          if(triesCount > GET_VOICES_MAX_TRIES_COUNT) {
            clearInterval(timerHandle);
            return reject();
          }

          const {voices} = await TextToSpeech.getSupportedVoices();
          if (voices.length) {
            clearInterval(timerHandle);
            const filtered = identify(voices).filter((voice) => {
              return voice.lang.replace('_', '-') === locale;
            });
            return resolve(filtered);
          }
          triesCount++;
        }, 10);
      });
    }
  }
};
