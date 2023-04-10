import React from 'react';
import {View, Linking, Alert} from 'react-native';

const NoPermissionScreen = () => {
  const openSettings = () => {
    Linking.openURL('app-settings:privacy?path=LOCATION');
  };

  return (
    <View style={styles.container}>
      {/* {Alert.alert(
        'Anna lupa käyttää sijaintia kun käytät sovellust',
        'Sijaintiasetukset',
        [
          {
            text: 'OK',
            onPress: () => openSettings(),
          },
        ],
        {cancelable: false},
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
