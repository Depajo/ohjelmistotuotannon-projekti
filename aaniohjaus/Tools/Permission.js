import {request, PERMISSIONS, check, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

const ios = async permissions => {
  if (Platform.OS === 'ios') {
    let ask = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
    return ask;
  }

  try {
    if (permissions !== RESULTS.GRANTED && Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      console.log('Result:', result);
      return result;
    }
  } catch (error) {
    console.log(error);
  }
};

const android = async permissions => {
  if (Platform.OS === 'android') {
    let ask = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    return ask;
  }
  try {
    if (permissions !== RESULTS.GRANTED && Platform.OS === 'android') {
      let result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      return result;
    }
  } catch (error) {
    console.log(error);
  }
};

export {ios, android};
