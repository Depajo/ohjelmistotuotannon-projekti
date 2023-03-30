import React from 'react';
import {
  View,
  Text,
  Linking,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ios} from '../Tools/Permission';

const NoPermissionScreen = () => {
  const openSettings = () => {
    Linking.openURL('app-settings:privacy?path=LOCATION');
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'red',
          fontSize: 30,
          margin: 10,
          textAlign: 'center',
        }}>
        Anna lupa käyttää sijaintia kun käytät sovellust
      </Text>
      <TouchableOpacity style={styles.touchableOpacity} onPress={openSettings}>
        <Text style={styles.text}>OK</Text>
      </TouchableOpacity>
      {/* {Alert.alert(
        'Anna lupa käyttää sijaintia kun käytät sovellust',
        'Sijaintiasetukset',
        [
          {
            text: 'OK',
            onPress: () => openSettings(),
          },
        ],
        {cancelable: true},
      )} */}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  touchableOpacity: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    width: 200,
  },
};

export default NoPermissionScreen;
