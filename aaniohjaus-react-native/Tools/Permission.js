import {request, PERMISSIONS, check, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

// This function asks permission to use location.
// If the user has not given permission, the function asks permission.
const ios = async () => {
  let ask;
  // Check if the platform is iOS
  if (Platform.OS === 'ios') {
    // If the location permission has not been granted, ask for it
    if (ask !== RESULTS.GRANTED) {
      ask = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      // If the location permission has been granted, ask for always permission
      ask = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
    }
  }

  try {
    // If the location permission has not been granted and the platform is iOS, request always permission
    if (ask !== RESULTS.GRANTED && Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      return result;
    }
  } catch (error) {
    console.log(error);
  }
  // Return the permission status
  return ask;
};

export {ios};
