import React, {useEffect} from 'react';
import {View, TouchableOpacity, Image, Linking, Platform} from 'react-native';
import {Appearance} from 'react-native';
import settings_white from '../Assets/settings_white.png';
import settings_black from '../Assets/settings_black.png';

const SettingsButton = () => {
  const [icon, setIcon] = React.useState(settings_white);
  useEffect(() => {
    if (Appearance.getColorScheme() === 'dark') {
      // setIcon(settings_black);
      setIcon(settings_white);
    } else {
      setIcon(settings_white);
    }
  }, []);

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:privacy?path=LOCATION');
    }

    if (Platform.OS === 'android') {
      Linking.openSettings();
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={openSettings}>
        <Image
          source={icon}
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
