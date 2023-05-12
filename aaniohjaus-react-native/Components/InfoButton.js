import React, {useEffect} from 'react';
import {View, TouchableOpacity, Image, Linking, Platform} from 'react-native';
import {Appearance} from 'react-native';
import info from '../Assets/info.png';

const InfoButton = () => {
  const [icon, setIcon] = React.useState(info);
  useEffect(() => {
    if (Appearance.getColorScheme() === 'dark') {
      setIcon(info);
    } else {
      setIcon(info);
    }
  }, []);

  const openInfo = () => {
    Linking.openURL('https://www.google.fi');
  };

  return (
    <View>
      <TouchableOpacity onPress={openInfo}>
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

export default InfoButton;
