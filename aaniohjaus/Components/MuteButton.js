import React, {useState} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import kaijutin from '../Assets/kaijutin.png';
import kaijutin_mute from '../Assets/kaijutin_mute.png';
import kaijutin_musta from '../Assets/kaijutin_musta.png';
import kaijutin_mute_musta from '../Assets/kaijutin_mute_musta.png';
import {Appearance} from 'react-native';

const MuteButton = ({mute, setMute}) => {
  const [icon, setIcon] = React.useState(kaijutin);

  useState(() => {
    if (Appearance.getColorScheme() === 'dark') {
      setIcon(kaijutin_musta);
    } else {
      setIcon(kaijutin);
    }
  }, []);

  const changeIcon = () => {
    if (mute) {
      if (Appearance.getColorScheme() === 'dark') {
        setIcon(kaijutin_musta);
      } else {
        setIcon(kaijutin);
      }
    } else {
      if (Appearance.getColorScheme() === 'dark') {
        setIcon(kaijutin_mute_musta);
      } else {
        setIcon(kaijutin_mute);
      }
    }
    setMute(!mute);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => changeIcon()}>
        <Image
          source={icon}
          style={{
            width: 55,
            height: 36,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MuteButton;
