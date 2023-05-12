import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SpeakLogo from '../Components/SpeakLogo';
import {Appearance} from 'react-native';

const YesPermissionScreen = ({address, getLocation, speeking}) => {
  const colorScheme = Appearance.getColorScheme();

  useEffect(() => {
    if (colorScheme === 'dark') {
      styles.TextStyle.color = 'white';
    } else {
      styles.TextStyle.color = 'black';
    }
    getLocation();
    setInterval(() => {
      getLocation();
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <SpeakLogo speeking={speeking} />
      {address != null ? (
        <View>
          <Text style={styles.TextStyle}>
            {address.katu}{' '}
            {'undefined' !== address.katunumero
              ? address.katunumero
              : 'Ei numeroa'}
          </Text>
          <Text style={styles.TextStyle}>{address.postinumero}</Text>
          <Text style={styles.TextStyle}>{address.kunta}</Text>
          <Text style={{color: 'grey', textAlign: 'center'}}>
            Etäisyys: {(address.distance_in_kms * 1000).toFixed(6)} metriä
          </Text>
        </View>
      ) : (
        <Text style={styles.TextStyle}>Ei sijaintia</Text>
      )}
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
    textAlign: 'center',
    color: '#808080',
    padding: 10,
    borderRadius: 10,
    fontSize: 30,
    marginTop: 5,
  },
});

export default YesPermissionScreen;
