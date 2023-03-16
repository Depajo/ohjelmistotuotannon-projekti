import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TextInput,
} from 'react-native';
import Tts from 'react-native-tts';
import {request, PERMISSIONS, check, RESULTS} from 'react-native-permissions';

const MainScreen = () => {
  const [katu, setKatu] = React.useState('Hämeenkadulla');
  const [permissions, setPermissions] = React.useState(null);

  useEffect(() => {
    console.log('useEffect');
    if (Platform.OS === 'ios') {
      ios();
    }
    if (Platform.OS === 'android') {
      android();
    }
  }, []);

  const ios = () => {
    console.log('useEffect');
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        setPermissions(result);
        console.log(result);
      });
    }

    try {
      if (permissions === RESULTS.DENIED && Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
          setPermissions(result);
          console.log(result);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const android = () => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        setPermissions(result);
        console.log(result);
      });
    }
    try {
      if (permissions === RESULTS.DENIED && Platform.OS === 'android') {
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
          setPermissions(result);
          console.log(result);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const speak = () => {
    if (Platform.OS === 'ios') {
      Tts.setDefaultLanguage('fi-FI');
      Tts.speak(katu, {
        iosVoiceId: 'com.apple.ttsbundle.Satu-compact',
        rate: 0.5,
      });
    }

    if (Platform.OS === 'android') {
      console.log('android');
      Tts.setDefaultLanguage('fi-FI');
      Tts.speak(katu, {
        androidParams: {
          KEY_PARAM_PITCH: 1,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    }

    console.log('speak');
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
