import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import speak from '../Tools/Speak';
import {Appearance} from 'react-native';

const SpeakAll = ({setSpeeking, address}) => {
  const colorSchema = Appearance.getColorScheme();
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
        const numerotValilla = numerot.join(';');
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
        if (address !== null) {
          setSpeeking(true);
          speakAddress(address.road);
          speakAddress(address.house_number);
          speakAddress(address.postcode);
          speakAddress(address.city);
          setTimeout(() => {
            setSpeeking(false);
          }, 5800);
        }
      }}>
      <Text style={styles.TextStyle}>TOISTA OSOITE</Text>
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
