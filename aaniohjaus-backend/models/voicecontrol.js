const connection = require("../connections/voicecontrol");
/**
 * databaseQuery sends query to database with parameters it gets from /controllers
 * ST_Distance_Sphere() takes given parameters as POINT and returns all data in a 100m radius from that POINT.
 */
const databaseQuery = {
  findBy: (latitude, longitude) =>
    new Promise((resolve, reject) => {
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

module.exports = databaseQuery;
