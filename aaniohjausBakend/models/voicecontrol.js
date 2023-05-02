const connection = require("../connections/voicecontrol");

const aaniohjaus = {
  findBy: (latitude, longitude) =>
    new Promise((resolve, reject) => {
      console.log(latitude, longitude);
      let query = `SELECT latitude, longitude, katu, katunumero, a.postinumero,k.kunta, ST_Distance_Sphere(POINT(?, ?), POINT(longitude, latitude)) * .001
      AS distance_in_kms
      FROM katutiedot
      INNER JOIN alue a
      ON katutiedot.alue_id = a.alue_id
      INNER JOIN kunta k
      ON a.kunta_id = k.kunta_id
      HAVING distance_in_kms <= 0.2
      ORDER BY distance_in_kms ASC;`;
      connection.query(query, [longitude, latitude], (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    }),
};

module.exports = aaniohjaus;
