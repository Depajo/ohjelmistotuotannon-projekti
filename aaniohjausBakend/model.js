const connection = require("./connection");

///TÄTÄ PITÄÄ MUOKATA MEIDÄN TIETOKANTAAN

const aaniohjaus = {
  findAll: () =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM katutiedot;", (err, result) => {
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
