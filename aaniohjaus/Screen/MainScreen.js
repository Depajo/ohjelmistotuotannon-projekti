import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {request, PERMISSIONS, check, RESULTS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import speak from '../Tools/Speak';
import fetchLocation from '../Tools/Fetch';
import {ios} from '../Tools/Permission';

const MainScreen = () => {
  const [address, setAddress] = React.useState(null);
  const [katu, setKatu] = React.useState(null);
  const [permissions, setPermissions] = React.useState(null);
  const [udpate, setUpdate] = React.useState('Not fetched');
  const [udpateLocation, setUpdateLocation] = React.useState(null);

  useEffect(() => {
    askPermission();

    if (katu != null) {
      speak(address.road).catch(error => {
        console.log(error);
      });
    }
  }, [katu]);

  const askPermission = () => {
    if (Platform.OS === 'ios') {
      setPermissions(ios());
    }
    if (Platform.OS === 'android') {
      setPermissions(android());
    }
  };

  const onOff = () => {
    console.log('onOff');
    if (udpate === 'Not fetched') {
      styles.MyButton.backgroundColor = 'green';
      if (katu != null) {
        speak(address.road).catch(error => {
          console.log(error);
        });
      }
      setUpdate('fetching');
      setUpdateLocation(
        setInterval(() => {
          getLocation();
        }, 1000),
      );
    } else {
      styles.MyButton.backgroundColor = 'red';
      clearInterval(udpateLocation);
      setUpdate('Not fetched');
    }
  };

  const getLocation = () => {
    if (permissions === 'granted') {
      Geolocation.getCurrentPosition(
        position => {
          // console.log(position);
          fetchLocation(position.coords.longitude, position.coords.latitude)
            .then(response => {
              setAddress(response.data.address);
              setKatu(response.data.address.road);
            })
            .catch(error => {
              console.log(error);
            });
        },
        error => {
          console.log(error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    }
  };

  // const ios = () => {
  //   if (Platform.OS === 'ios') {
  //     check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
  //       setPermissions(result);
  //       console.log(result);
  //     });
  //   }

  //   try {
  //     if (permissions !== RESULTS.GRANTED && Platform.OS === 'ios') {
  //       request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
  //         setPermissions(result);
  //         console.log(result);
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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

  if (permissions === 'granted') {
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
  } else {
    return (
      <View style={styles.container}>
        <Text
          style={{
            color: 'red',
            fontSize: 30,
            margin: 10,
            textAlign: 'center',
          }}>
          Anna lupa käyttää sijaintia kun käytät sovellust
        </Text>
      </View>
    );
  }
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

export default MainScreen;
