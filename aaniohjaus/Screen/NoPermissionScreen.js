import React from 'react';
import {View, Text} from 'react-native';

const NoPermissionScreen = () => {
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
