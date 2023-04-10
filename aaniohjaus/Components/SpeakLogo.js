import React from 'react';
import {Image, StyleSheet} from 'react-native';
import aani_1 from '../Assets/aani_1.png';
import aani2 from '../Assets/aani2.png';
import aani_1_valkoinen from '../Assets/aani_1_valkoinen.png';
import aani2_valkoinen from '../Assets/aani2_valkoinen.png';
import {Appearance} from 'react-native';

const SpeakLogo = ({speeking}) => {
  const colorScheme = Appearance.getColorScheme();
  const [intervalRun, setIntervalRun] = React.useState(null);
  const [image, setImage] = React.useState(aani_1);
  React.useEffect(() => {
    if (speeking) {
      changeImage();
    } else {
      if (intervalRun != null) {
        clearInterval(intervalRun);
      }

      if (colorScheme === 'dark') {
        setImage(aani_1_valkoinen);
      } else {
        setImage(aani_1);
      }
    }
  }, [speeking]);

  const changeImage = () => {
    let change = true;
    const interval = setInterval(() => {
      if (change) {
        change = false;
        if (colorScheme === 'dark') {
          setImage(aani_1_valkoinen);
        } else {
          setImage(aani_1);
        }
      } else {
        change = true;
        if (colorScheme === 'dark') {
          setImage(aani2_valkoinen);
        } else {
          setImage(aani2);
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
