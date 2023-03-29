import {request, PERMISSIONS, check, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

const ios = permissions => {
  if (Platform.OS === 'ios') {
    check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
      console.log(result);
      return result;
    });
  }

  try {
    if (permissions !== RESULTS.GRANTED && Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        return result;
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const android = async permissions => {
  if (Platform.OS === 'android') {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
      return result;
    });
  }
  try {
    if (permissions !== RESULTS.GRANTED && Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        return result;
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export {ios, android};
