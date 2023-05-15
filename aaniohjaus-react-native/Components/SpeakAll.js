import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {speak, stopSpeak} from '../Tools/Speak';
import {Appearance} from 'react-native';
import {enable} from 'react-native-volume-manager';
import Tts from 'react-native-tts';

const SpeakAll = ({speeking, setSpeeking, address}) => {
  const colorSchema = Appearance.getColorScheme();
  const [disabled, setDisabled] = React.useState(false);
  if (colorSchema === 'dark') {
    styles.button.backgroundColor = 'black';
  } else {
    styles.button.backgroundColor = '#292d32';
  }

  const speakAddress = word => {
    console.log(!isNaN(word));
    if (word !== 'undefined' && word !== undefined && word !== null) {
      if (!isNaN(word)) {
        const numerot = word.split('');
        const numerotValilla = numerot.join(' ');
        speak(' ' + numerotValilla);
      } else {
        speak(`${word}`);
      }
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        Tts.addEventListener('tts-start', event => {
          setSpeeking(true);
        });
        if (speeking) {
          stopSpeak();
        } else {
          speakAddress(address.katu);
          speakAddress(address.katunumero);
          speakAddress(address.postinumero);
          speakAddress(address.kunta);
        }
        Tts.addEventListener('tts-finish', event => {
          setSpeeking(false);
        });
      }}
      disabled={disabled || address === null}>
      <Text style={styles.TextStyle}>
        {speeking ? 'PYSÄYTÄ TOISTO' : 'TOISTA OSOITE'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  TextStyle: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
  },
  button: {
    backgroundColor: 'black',
    width: 300,
    height: 70,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpeakAll;
