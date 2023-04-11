import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Linking} from 'react-native';
import {Appearance} from 'react-native';
import settings_valkoinen from '../Assets/settings_valkoinen.png';
import settings_musta from '../Assets/settings_musta.png';

const SettingsButton = () => {
  const [icon, setIcon] = React.useState(settings_valkoinen);
  useEffect(() => {
    if (Appearance.getColorScheme() === 'dark') {
      setIcon(settings_musta);
    } else {
      setIcon(settings_valkoinen);
    }
  }, []);

  const openSettings = () => {
    Linking.openURL('app-settings:privacy?path=LOCATION');
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
