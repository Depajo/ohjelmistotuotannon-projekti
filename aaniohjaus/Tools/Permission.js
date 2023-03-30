import {request, PERMISSIONS, check, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

const ios = async () => {
  let ask;
  if (Platform.OS === 'ios') {
    ask = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
  }

  try {
    if (ask !== RESULTS.GRANTED && Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      return result;
    }
  } catch (error) {
    console.log(error);
  }
  return ask;
};

const android = async () => {
  let ask;
  if (Platform.OS === 'android') {
    ask = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  }
  try {
    if (ask !== RESULTS.GRANTED && Platform.OS === 'android') {
      let result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      return result;
    }
  } catch (error) {
    console.log(error);
  }
  return ask;
};

export {ios, android};
