import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import SpeakLogo from '../Components/SpeakLogo';

const YesPermissionScreenTwo = ({address, onOff}) => {
  useEffect(() => {
    onOff();
  }, []);

  return (
    <View style={styles.container}>
      {address != null ? (
        <Text style={styles.TextStyle}>
          {address.road + ' ' + address.house_number}
        </Text>
      ) : (
        <Text style={styles.TextStyle}>Ei sijaintia</Text>
      )}
      <SpeakLogo speeking={false} />
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
