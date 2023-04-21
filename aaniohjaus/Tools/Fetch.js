import axios from 'axios';

const fetchLocation = (longitude, latitude) => {
  return new Promise((resolve, reject) => {
    axios
      // .get(
      //   'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' +
      //     latitude +
      //     '&lon=' +
      //     longitude,
      // )
      .get(
        'https://katutiedot-api.onrender.com/api/katutiedot/' +
          latitude +
          '/' +
          longitude,
      )
      .then(response => {
        console.log(response.data[0]);
        resolve(response.data[0]);
      })
      .catch(error => {
        console.log(error.message);
        reject('error');
      });
  });
};

export default fetchLocation;
