import React, {useEffect} from 'react';
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import speak from '../Tools/Speak';
import fetchLocation from '../Tools/Fetch';
import {ios, android} from '../Tools/Permission';
import YesPermissionScreenTwo from './YesPermissionScreen';
import NoPermissionScreen from './NoPermissionScreen';
import '../Components/MuteButton';
import MuteButton from '../Components/MuteButton';
import SettingsButton from '../Components/SettingsButton';
import SpeakAll from '../Components/SpeakAll';
import {Appearance} from 'react-native';

const MainScreen = () => {
  const [address, setAddress] = React.useState(null);
  const [katu, setKatu] = React.useState(null);
  const [permissions, setPermissions] = React.useState(null);
  const [speeking, setSpeeking] = React.useState(false);
  const [mute, setMute] = React.useState(false);

  useEffect(() => {
    const colorSchema = Appearance.getColorScheme();
    if (colorSchema === 'dark') {
      styles.menu.backgroundColor = '#7C7C7C';
    } else {
      styles.menu.backgroundColor = '#2C2C2C';
    }
    askPermission();
    console.log(mute);
    if (katu != null && mute === false) {
      setSpeeking(true);
      speak(address.road)
        .then(() => {
          setTimeout(() => {
            setSpeeking(false);
          }, 1500);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [katu, mute]);

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

  if (permissions === 'granted') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.SafeAreaView} />
        <View style={styles.menu}>
          <View style={{flex: 1, alignItems: 'flex-start', margin: 10}}>
            <SettingsButton />
          </View>
          <View style={{flex: 1, alignItems: 'flex-end', margin: 10}}>
            <MuteButton mute={mute} setMute={setMute} />
          </View>
        </View>
        <View style={{flex: 7}}>
          <YesPermissionScreenTwo
            address={address}
            getLocation={getLocation}
            speeking={speeking}
          />
        </View>
        <SpeakAll setSpeeking={setSpeeking} address={address} />
        <SafeAreaView />
      </View>
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
  },
  menu: {
    flex: 0.6,
    flexDirection: 'row',
    backgroundColor: '#585858',
  },
  SafeAreaView: {
    backgroundColor: '#585858',
  },
});

export default MainScreen;
