import React, {useEffect} from 'react';
import {Platform, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import speak from '../Tools/Speak';
import fetchLocation from '../Tools/Fetch';
import {ios, android} from '../Tools/Permission';
import YesPermissionScreen from './YesPermissionScreen';
import NoPermissionScreen from './NoPermissionScreen';
import '../Components/MuteButton';
import MuteButton from '../Components/MuteButton';
import SettingsButton from '../Components/SettingsButton';
import SpeakAll from '../Components/SpeakAll';
import {Appearance, AppState} from 'react-native';
import {VolumeManager} from 'react-native-volume-manager';

const MainScreen = () => {
  const [address, setAddress] = React.useState(null);
  const [street, setStreet] = React.useState(null);
  const [permissions, setPermissions] = React.useState(null);
  const [speeking, setSpeeking] = React.useState(false);
  const [mute, setMute] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [speed, setSpeed] = React.useState(0);
  const firstUpdate = React.useRef(true);

  useEffect(() => {
    AppState.addEventListener('change', state => {
      if (state === 'active') {
        askPermission();
      }
    });
    const colorSchema = Appearance.getColorScheme();
    if (colorSchema === 'dark') {
      styles.menu.backgroundColor = '#0d0d0d';
      styles.container.backgroundColor = '#3a3a3a';
      styles.safeAreaView.backgroundColor = '#0d0d0d';
    } else {
      styles.menu.backgroundColor = '#292d32';
      styles.container.backgroundColor = '#f3f2f2';
      styles.safeAreaView.backgroundColor = '#292d32';
    }

    askPermission();

    if (street != null && mute === false) {
      setSpeeking(true);
      speak(address.katu)
        .then(() => {
          setTimeout(() => {
            setSpeeking(false);
          }, 1500);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [street, mute]);

  VolumeManager.enableInSilenceMode(true);

  const askPermission = async () => {
    if (Platform.OS === 'ios') {
      let permissions = await ios();
      setPermissions(permissions);
    }
    if (Platform.OS === 'android') {
      let permissions = await android();
      setPermissions(permissions);
    }
  };

  const getLocation = () => {
    if (permissions === 'granted') {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          setSpeed(position.coords.speed);

          if (position.coords.speed > 0.2 || firstUpdate.current) {
            firstUpdate.current = false;
            setCount(count => count + 1);
            fetchLocation(position.coords.longitude, position.coords.latitude)
              .then(response => {
                // console.log(response);
                setAddress(response);
                setStreet(response.katu);
              })
              .catch(error => {
                console.log(error);
              });
          }
        },
        error => {
          console.log(error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    }
  };

  if (permissions === 'granted') {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <View style={styles.menu}>
            <View style={{flex: 1, alignItems: 'flex-start', margin: 10}}>
              <SettingsButton />
            </View>
            <View style={{flex: 1, alignItems: 'flex-end', margin: 10}}>
              <MuteButton mute={mute} setMute={setMute} />
            </View>
          </View>
          <View style={{flex: 7}}>
            <YesPermissionScreen
              address={address}
              getLocation={getLocation}
              speeking={speeking}
            />
            <Text
              style={{color: 'grey', textAlign: 'center', marginBottom: 10}}>
              Sijaintia päivitetty: {count} kertaa{' '}
            </Text>
            <Text
              style={{color: 'grey', textAlign: 'center', marginBottom: 10}}>
              Nopeus: {speed} km/h
            </Text>
          </View>
          <View style={{flex: 2}}>
            <SpeakAll setSpeeking={setSpeeking} address={address} />
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <View>
        <NoPermissionScreen permissions={permissions} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3a3a3a',
  },
  menu: {
    flex: 0.7,
    flexDirection: 'row',
    backgroundColor: '#0d0d0d',
  },

  safeAreaView: {
    backgroundColor: 'white',
  },
});

export default MainScreen;
