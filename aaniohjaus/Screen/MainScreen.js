import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TextInput,
} from 'react-native';
import Tts from 'react-native-tts';

const MainScreen = () => {
  const [katu, setKatu] = React.useState('Hämeenkadulla');

  const speak = () => {
    if (Platform.OS === 'ios') {
      Tts.setDefaultLanguage('fi-FI');
      Tts.speak(katu, {
        iosVoiceId: 'com.apple.ttsbundle.Satu-compact',
        rate: 0.5,
      });
    }

    if (Platform.OS === 'android') {
      Tts.setDefaultLanguage('fi-FI');
      Tts.speak(katu, {
        androidParams: {
          KEY_PARAM_PITCH: 1,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.TextInput}
        value={katu}
        onChangeText={setKatu}
        placeholder={'Hämeenkatu'}
      />
      <Button title="Click" onPress={speak} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextInput: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 20,
  },
});

export default MainScreen;
