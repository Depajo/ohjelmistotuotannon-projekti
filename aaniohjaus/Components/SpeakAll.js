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

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        if (address !== null) {
          setSpeeking(true);
          speak(
            `${address.road} ${address.house_number} ${address.postcode} ${address.city}`,
          );
          setTimeout(() => {
            setSpeeking(false);
          }, 4500);
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
