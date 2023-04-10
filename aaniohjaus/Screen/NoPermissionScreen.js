import React, {useEffect} from 'react';
import {View, Linking, Alert} from 'react-native';

const NoPermissionScreen = ({permissions}) => {
  useEffect(() => {
    if (permissions === 'denied' || permissions === 'blocked') {
      createAlert();
    }
  }, [permissions]);
  const openSettings = () => {
    Linking.openURL('app-settings:privacy?path=LOCATION');
  };

  const createAlert = () => {
    Alert.alert(
      'Anna lupa käyttää sijaintia kun käytät sovellust',
      'Sijaintiasetukset',
      [
        {
          text: 'OK',
          onPress: () => openSettings(),
        },
      ],
      {cancelable: false},
    );
  };
  return <View style={styles.container}>{}</View>;
};

const styles = {
  container: {
    flex: 1,
    bavkgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
};

export default NoPermissionScreen;
