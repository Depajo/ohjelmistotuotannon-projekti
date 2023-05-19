import React, {useEffect} from 'react';
import {View, Linking, Alert, Platform, Text, Button} from 'react-native';

const NoPermissionScreen = ({permissions}) => {
  useEffect(() => {
    console.log('useEffect');
    // If the location permissions are denied or blocked, create an alert
    if (permissions === 'denied' || permissions === 'blocked') {
      createAlert();
    }
  }, [permissions]);

  const openSettings = () => {
    // Open the app settings for location permissions
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:privacy?path=LOCATION');
    } else {
      Linking.openSettings();
    }
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

  return (
    <View style={styles.container}>
      {/* <Text style={styles.TextStyle}>Sulje sovellus ja avaa uudestaan</Text> */}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextStyle: {
    textAlign: 'center',
    color: '#808080',
    padding: 10,
    borderRadius: 10,
    fontSize: 30,
    marginTop: 5,
  },
};

export default NoPermissionScreen;
