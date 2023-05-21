import React from 'react';
import {View, TouchableOpacity, Image, Linking, Platform} from 'react-native';
import settings_white from '../Assets/settings_white.png';

// This is the settings button that is used to open the location settings of the phone.
// It is called in the MainScreen.js.
const SettingsButton = () => {
  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:privacy?path=LOCATION');
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={openSettings}>
        <Image
          source={settings_white}
          style={{
            width: 40,
            height: 40,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SettingsButton;
