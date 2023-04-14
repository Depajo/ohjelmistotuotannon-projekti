const connection = require("../connections/voicecontrol");

/*
findAll() sisältää yhden testihaun, ellalla työnalla spatial indexin hahmotus, palaan sunnuntaina asiaan
*/

const aaniohjaus = {
  findAll: () =>
    new Promise((resolve, reject) => {
      var latitude = 61.498139;
      var longitude = 23.751500;
      connection.query(`SELECT * FROM katutiedot 
        WHERE latitude BETWEEN ROUND(${latitude}, 5) AND ROUND(${latitude}, 5) 
        AND longitude BETWEEN ROUND(${longitude}, 5) AND ROUND(${longitude}, 5);`, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    }),

  /// findby koordinaatit

  findBy: (select) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM katutiedot WHERE ?;",
        select,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    }),
};

module.exports = aaniohjaus;
