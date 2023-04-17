const connection = require("../connections/voicecontrol");

/*
findAll() sisältää yhden testihaun:
TO DO:
- longitude ja latitude muuttujiin testiarvojen sijalle käyttäjän sijaintitiedot
- tällä hetkellä palauttaa lähinnä olevat arvot 0.5km lähin ensimmäisenä, tehtävä jatkokäsittely
jotta vain lähinnä oleva osoite palautetaan ääneen sanottavaksi
- ST_Distance_Sphere(Point, Point) * .001 muuntaa etäisyyden kilometreiksi
*/

const aaniohjaus = {
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

    /// findby koordinaatit

    findBy: (select) =>
        new Promise((resolve, reject) => {
            console.log(select);
            let query = "SELECT * FROM katutiedot WHERE ?;";
            connection.query(query, select, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        }),
};

module.exports = aaniohjaus;
