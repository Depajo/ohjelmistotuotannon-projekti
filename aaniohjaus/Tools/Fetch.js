import axios from 'axios';

const fetchLocation = (longitude, latitude) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' +
          latitude +
          '&lon=' +
          longitude,
      )
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(error.message);
        reject('error');
      });
  });
};

export default fetchLocation;
