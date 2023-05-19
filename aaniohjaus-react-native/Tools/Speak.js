import {Platform} from 'react-native';
import Tts from 'react-native-tts';

const speak = address => {
  return new Promise((resolve, reject) => {
    // Check if the platform is iOS
    if (Platform.OS === 'ios') {
      // Set the default language for speech synthesis
      Tts.setDefaultLanguage('fi-FI');
      // Speak the given address using the specified voice and rate
      Tts.speak(address, {
        iosVoiceId: 'com.apple.ttsbundle.Sauli-compact',
        rate: 0.52,
      });
      // Resolve the promise with success
      resolve('success');
    }

    // Check if the platform is Android
    if (Platform.OS === 'android') {
      // Add an event listener for when the speech starts
      Tts.addEventListener('tts-start', event => console.log('start'));
      // Set the default language for speech synthesis
      Tts.setDefaultLanguage('fi-FI');
      // Speak the given address using the specified parameters
      Tts.speak(address, {
        androidParams: {
          KEY_PARAM_PITCH: 1,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
      // Add an event listener for when the speech finishes
      Tts.addEventListener('tts-finish', event => console.log('finish'));
      // Resolve the promise with success
      resolve('success');
    }
    // Reject the promise with an error if the platform is neither iOS nor Android
    reject('error');
  });
};

const stopSpeak = () => {
  // Stop the ongoing speech synthesis
  Tts.stop();
};

export {speak, stopSpeak};
