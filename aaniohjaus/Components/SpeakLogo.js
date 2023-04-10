import React from 'react';
import {Image, StyleSheet} from 'react-native';
import aani_1 from '../Assets/aani_1.png';
import aani2 from '../Assets/aani2.png';
import Tts from 'react-native-tts';

const SpeakLogo = ({speeking}) => {
  const [intervalRun, setIntervalRun] = React.useState(null);
  const [image, setImage] = React.useState(aani_1);
  React.useEffect(() => {
    if (speeking) {
      changeImage();
    } else {
      if (intervalRun != null) {
        clearInterval(intervalRun);
      }
      setImage(aani_1);
    }
  }, [speeking]);

  const changeImage = () => {
    let change = true;
    const interval = setInterval(() => {
      if (change) {
        change = false;
        setImage(aani_1);
      } else {
        change = true;
        setImage(aani2);
      }
    }, 500);
    setIntervalRun(interval);
  };

  return <Image source={image} style={styles.ImageStyle} />;
};

const styles = StyleSheet.create({
  ImageStyle: {
    width: 200,
    height: 200,
  },
});

export default SpeakLogo;
