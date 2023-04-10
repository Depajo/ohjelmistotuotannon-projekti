import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import speak from '../Tools/Speak';

const SpeakAll = ({setSpeeking, address}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        setSpeeking(true);
        speak(
          `${address.road} ${address.house_number} ${address.postcode} ${address.city}`,
        );
        setTimeout(() => {
          setSpeeking(false);
        }, 4500);
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
    backgroundColor: '#585858',
    width: 300,
    height: 70,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpeakAll;
