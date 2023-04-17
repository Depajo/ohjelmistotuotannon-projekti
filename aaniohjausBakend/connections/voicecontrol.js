const mysql = require("mysql");
require("dotenv").config();

/*
HUOM!! jos käyttää user: process.env.USERNAME, niin API ei tunnista USERNAME:en tallennettua käyttäjää
vaan ottaa tietokoneen käyttäjän nimen, tämä huomioksi kun teette omat .env-tiedostot./Ella
 */

const connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

module.exports = connection;
