import React, {useEffect} from 'react';
import {View, Linking, Alert, Platform, Text, Button} from 'react-native';
import {ios, android} from '../Tools/Permission';

const NoPermissionScreen = ({permissions}) => {
  useEffect(() => {
    console.log('useEffect');
    if (permissions === 'denied' || permissions === 'blocked') {
      createAlert();
    }
  }, [permissions]);

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:privacy?path=LOCATION');
    } else {
      Linking.openSettings();
    }
  };

  const checkPermission = () => {
    if (Platform.OS === 'ios') {
      ios();
    } else {
      android();
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
      <Text style={styles.TextStyle}>Sulje sovellus ja avaa uudestaan</Text>
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
