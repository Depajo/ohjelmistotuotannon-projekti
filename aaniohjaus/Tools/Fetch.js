import axios from 'axios';

const fetchLocation = (longitude, latitude) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        'https://www.api.joonatandepascale.fi/api/katutiedot/' +
          latitude +
          '/' +
          longitude,
      )
      .then(response => {
        // console.log(response.data[0]);
        resolve(response.data[0]);
      })
      .catch(error => {
        // console.log(error.message);
        reject('error');
      });
  });
};

export default fetchLocation;
