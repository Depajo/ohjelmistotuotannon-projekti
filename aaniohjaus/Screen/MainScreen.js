import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import speak from '../Tools/Speak';
import fetchLocation from '../Tools/Fetch';
import {ios, android} from '../Tools/Permission';
import NoPermissionScreen from './NoPermissionScreen';
import YesPermissionScreen from './YesPermissionScreen';
import YesPermissionScreenTwo from './YesPermissionScreenTwo';

const MainScreen = () => {
  const [address, setAddress] = React.useState(null);
  const [katu, setKatu] = React.useState(null);
  const [permissions, setPermissions] = React.useState(null);
  const [speeking, setSpeeking] = React.useState(false);

  useEffect(() => {
    askPermission();
    if (katu != null) {
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
  }, [katu]);

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
      <YesPermissionScreenTwo
        address={address}
        getLocation={getLocation}
        speeking={speeking}
      />
    );
  } else {
    return <NoPermissionScreen />;
  }
};

export default MainScreen;
