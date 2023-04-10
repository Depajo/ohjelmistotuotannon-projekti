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
      setIcon(kaijutin);
    } else {
      setIcon(kaijutin_musta);
    }
  }, []);

  const changeIcon = () => {
    if (mute) {
      if (Appearance.getColorScheme() === 'dark') {
        setIcon(kaijutin);
      } else {
        setIcon(kaijutin_musta);
      }
    } else {
      if (Appearance.getColorScheme() === 'dark') {
        setIcon(kaijutin_mute);
      } else {
        setIcon(kaijutin_mute_musta);
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
            // position: 'relative',
            // top: 20,
            // left: 205,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MuteButton;
