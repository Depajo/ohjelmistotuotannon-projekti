import React from 'react';
import {Image, StyleSheet} from 'react-native';
import voice1 from '../Assets/voice1.png';
import voice2 from '../Assets/voice2.png';
import voice1_white from '../Assets/voice1_white.png';
import voice2_white from '../Assets/voice2_white.png';
import {isSpeaking} from '../Tools/Speak';
import {Appearance} from 'react-native';

const SpeakLogo = ({speeking}) => {
  const colorScheme = Appearance.getColorScheme();
  const [intervalRun, setIntervalRun] = React.useState(null);
  const [image, setImage] = React.useState(voice1);
  React.useEffect(() => {
    if (speeking) {
      changeImage();
    } else {
      if (intervalRun != null) {
        clearInterval(intervalRun);
      }

      if (colorScheme === 'dark') {
        setImage(voice1_white);
      } else {
        setImage(voice1);
      }
    }
  }, [speeking]);

  const changeImage = () => {
    let change = true;
    const interval = setInterval(() => {
      if (change) {
        change = false;
        if (colorScheme === 'dark') {
          setImage(voice1_white);
        } else {
          setImage(voice1);
        }
      } else {
        change = true;
        if (colorScheme === 'dark') {
          setImage(voice2_white);
        } else {
          setImage(voice2);
        }
      }
    }, 200);
    setIntervalRun(interval);
  };

  return <Image source={image} style={styles.ImageStyle} />;
};

const styles = StyleSheet.create({
  ImageStyle: {
    width: 250,
    height: 250,
    margin: 20,
  },
});

export default SpeakLogo;
