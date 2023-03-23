import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import Tts from 'react-native-tts';
import {request, PERMISSIONS, check, RESULTS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const MainScreen = () => {
  const [katu, setKatu] = React.useState(null);
  const [permissions, setPermissions] = React.useState(null);
  const [udpate, setUpdate] = React.useState('Not fetched');
  const [udpateLocation, setUpdateLocation] = React.useState(null);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      ios();
    }
    if (Platform.OS === 'android') {
      android();
    }
    if (katu != null) {
      speak();
    }
  }, [katu]);

  const onOff = () => {
    console.log('onOff');
    if (udpate === 'Not fetched') {
      console.log('fetching location');
      setUpdate('fetching');
      setUpdateLocation(
        setInterval(() => {
          getLocation();
        }, 1000),
      );
    } else {
      console.log('not fetching location');
      clearInterval(udpateLocation);
      setUpdate('Not fetched');
    }
  };

  const getLocation = () => {
    if (permissions === RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          fetchLocation(position.coords.longitude, position.coords.latitude);
        },
        error => {
          console.log(error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    }
  };

  const fetchLocation = (longitude, latitude) => {
    console.log(
      'https://nominatim.openstreetmap.org/reverse?lat=' +
        latitude +
        'lon=' +
        longitude,
    );

    axios
      .get(
        'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' +
          latitude +
          '&lon=' +
          longitude,
      )
      .then(response => {
        console.log(response.data);
        setKatu(response.data.address.road);
      })
      .catch(error => {
        console.log(error.message);
      });

    // fetch(
    //   'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}',
    // )
    //   .then(response => response.json())
    //   .then(data => {
    //     // console.log(data);
    //     setKatu(data.address.road);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    console.log('fetching location');
  };

  const ios = () => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        setPermissions(result);
        console.log(result);
      });
    }

    try {
      if (permissions !== RESULTS.GRANTED && Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
          setPermissions(result);
          console.log(result);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const android = () => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        setPermissions(result);
        console.log(result);
      });
    }
    try {
      if (permissions !== RESULTS.GRANTED && Platform.OS === 'android') {
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
          setPermissions(result);
          console.log(result);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const speak = () => {
    console.log('speak');

    if (Platform.OS === 'ios') {
      Tts.setDefaultLanguage('fi-FI');
      Tts.speak(katu, {
        iosVoiceId: 'com.apple.ttsbundle.Satu-compact',
        rate: 0.5,
      });
    }

    if (Platform.OS === 'android') {
      console.log('android');
      Tts.setDefaultLanguage('fi-FI');
      Tts.speak(katu, {
        androidParams: {
          KEY_PARAM_PITCH: 1,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.TextInput}>{katu}</Text>
      <TouchableOpacity style={styles.MyButton} onPress={speak}>
        <Text style={styles.ButtonText}>Puhu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.MyButton} onPress={onOff}>
        <Text style={styles.ButtonText}>Sijainti</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  TextInput: {
    height: 40,
    textAlign: 'center',
    width: 200,
    borderColor: 'gray',
    color: 'black',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 20,
    marginTop: 5,
  },

  MyButton: {
    height: 50,
    width: 200,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'red',
    marginTop: 5,
  },
  ButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default MainScreen;
