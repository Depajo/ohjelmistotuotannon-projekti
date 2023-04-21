const connection = require("../connections/voicecontrol");

/*
findAll() sisältää yhden testihaun:
TO DO:
- longitude ja latitude muuttujiin testiarvojen sijalle käyttäjän sijaintitiedot
- tällä hetkellä palauttaa lähinnä olevat arvot 0.2km lähin ensimmäisenä, tehtävä jatkokäsittely
jotta vain lähinnä oleva osoite palautetaan ääneen sanottavaksi
- ST_Distance_Sphere(Point, Point) * .001 muuntaa etäisyyden kilometreiksi
*/

const aaniohjaus = {
/*
    findAll: () =>
        new Promise((resolve, reject) => {
            var latitude = 61.498139;
            var longitude = 23.7515;
            connection.query(
                `SELECT *, ST_Distance_Sphere(POINT(${longitude}, ${latitude}), POINT(longitude, latitude)) * .001 AS distance_in_kms
      FROM katutiedot
      HAVING distance_in_kms <= 0.5
      ORDER BY distance_in_kms ASC;`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                }
            );
        }),

  */
    /// findby koordinaatit

    findBy: (latitude, longitude) =>
        new Promise((resolve, reject) => {
            console.log(latitude, longitude);
            let query = `SELECT *, ST_Distance_Sphere(POINT(?, ?), POINT(longitude, latitude)) * .001 AS distance_in_kms
            FROM katutiedot
            HAVING distance_in_kms <= 0.2
            ORDER BY distance_in_kms ASC;`;
            connection.query(query, [longitude, latitude], 
              (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        }),
};

module.exports = aaniohjaus;
