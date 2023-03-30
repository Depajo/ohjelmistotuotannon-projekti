import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const YesPermissionScreen = ({address, onOff, udpate}) => {
  if (udpate === 'fetching') {
    styles.MyButton.backgroundColor = 'green';
  } else {
    styles.MyButton.backgroundColor = 'red';
  }
  return (
    <View style={styles.container}>
      {address != null ? (
        <Text style={styles.TextStyle}>
          {address.road + ' ' + address.house_number}
        </Text>
      ) : (
        <Text style={styles.TextStyle}>Ei sijaintia</Text>
      )}
      <TouchableOpacity
        style={({backgroundColor: 'green'}, styles.MyButton)}
        onPress={onOff}>
        {udpate === 'Not fetched' ? (
          <Text style={styles.ButtonText}>Off</Text>
        ) : (
          <Text style={styles.ButtonText}>On</Text>
        )}
      </TouchableOpacity>
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

  MyButton: {
    height: 100,
    width: 100,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'blue',
    marginTop: 50,
    justifyContent: 'center',
  },
  ButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default YesPermissionScreen;
