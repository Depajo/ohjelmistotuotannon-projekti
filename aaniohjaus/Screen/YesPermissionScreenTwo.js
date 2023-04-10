import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import SpeakLogo from '../Components/SpeakLogo';
import {Appearance} from 'react-native';

const YesPermissionScreenTwo = ({address, getLocation, speeking}) => {
  const colorScheme = Appearance.getColorScheme();
  useEffect(() => {
    if (colorScheme === 'dark') {
      styles.TextStyle.color = 'white';
    } else {
      styles.TextStyle.color = 'black';
    }
    setInterval(() => {
      getLocation();
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      {address != null ? (
        <View>
          <Text style={styles.TextStyle}>{address.road}</Text>
          <Text style={styles.TextStyle}>{address.house_number}</Text>
        </View>
      ) : (
        <Text style={styles.TextStyle}>Ei sijaintia</Text>
      )}
      <SpeakLogo speeking={speeking} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  TextStyle: {
    height: 40,
    textAlign: 'center',
    color: '#808080',
    padding: 10,
    borderRadius: 10,
    fontSize: 30,
    marginTop: 5,
  },
});

export default YesPermissionScreenTwo;
