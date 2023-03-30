import React from 'react';
import {View, Text, Linking, Button} from 'react-native';

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
      <Button title="Asetukset" onPress={openSettings} />
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
};

export default NoPermissionScreen;
