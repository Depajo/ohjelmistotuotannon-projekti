import {Platform} from 'react-native';
import Tts from 'react-native-tts';

const speak = address => {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      Tts.addEventListener('tts-start', event => console.log('start', event));
      Tts.setDefaultLanguage('fi-FI');
      Tts.speak(address, {
        iosVoiceId: 'com.apple.ttsbundle.Sauli-compact',
        rate: 0.52,
      });
      Tts.addEventListener('tts-finish', event => console.log('finish', event));
      resolve('success');
    }

    if (Platform.OS === 'android') {
      Tts.addEventListener('tts-start', event => console.log('start', event));
      Tts.setDefaultLanguage('fi-FI');
      Tts.speak(address, {
        androidParams: {
          KEY_PARAM_PITCH: 1,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
      Tts.addEventListener('tts-finish', event => console.log('finish', event));
      resolve('success');
    }
    reject('error');
  });
};

export default speak;
