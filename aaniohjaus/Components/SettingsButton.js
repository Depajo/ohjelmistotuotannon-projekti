import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Linking} from 'react-native';
import {Appearance} from 'react-native';
import asetukset_valkoinen from '../Assets/asetukset_valkoinen.png';
import asetukset_musta from '../Assets/asetukset_musta.png';

const SettingsButton = () => {
  const [icon, setIcon] = React.useState(asetukset_valkoinen);
  useEffect(() => {
    if (Appearance.getColorScheme() === 'dark') {
      setIcon(asetukset_valkoinen);
    } else {
      setIcon(asetukset_musta);
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
