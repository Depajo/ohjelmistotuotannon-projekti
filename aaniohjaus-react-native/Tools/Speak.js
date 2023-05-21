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
  });
};

const stopSpeak = () => {
  // Stop the ongoing speech synthesis
  Tts.stop();
};

export {speak, stopSpeak};
