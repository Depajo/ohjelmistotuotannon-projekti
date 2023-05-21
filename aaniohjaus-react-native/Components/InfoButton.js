import React, {useEffect} from 'react';
import {View, TouchableOpacity, Image, Linking, Platform} from 'react-native';
import {Appearance} from 'react-native';
import info from '../Assets/info.png';

// InfoButton is a function that opens a link to a web page,
// that contains information about the app.
// It is called in the MainScreen.js.
const InfoButton = () => {
  const openInfo = () => {
    Linking.openURL('https://homepages.tuni.fi/lotta.haverinen/tekijat.html');
  };

  return (
    <View>
      <TouchableOpacity onPress={openInfo}>
        <Image
          source={info}
          style={{
            width: 40,
            height: 40,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default InfoButton;
