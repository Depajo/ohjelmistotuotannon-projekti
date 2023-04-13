const { resolve } = require('path');
const connection = require("../connections/voicecontrol");


const aaniohjaus = {
	
	/**
	 * TO DO:
	 * käyttäjän koordinaatit muuttujiin, tällä hetkellä muuttujissa vakiona 
	 * testikoordinaatit
	 */
findAll: () => new Promise((resolve, reject) => {
	var latitude = 61.5376050;
	var longitude = 23.9166410;
	connection.query(`SELECT * FROM katutiedot WHERE latitude BETWEEN ${latitude}-0.0000050 AND ${latitude} +0.0000050 AND longitude BETWEEN ${longitude}-0.0000050 AND ${longitude}+0.0000050` , (err, result) => {
    	if (err) {
    	  reject(err);
    	}
    	resolve(result);
  	});
}),

/// findby koordinaatit

findBy: (select) => new Promise((resolve, reject) => {
	connection.query("SELECT * FROM katutiedot WHERE ?;", select, (err, result) => {
    	if (err) {
    	  reject(err);
      	}
      	resolve(result);
    	})
	}),
};

module.exports = aaniohjaus;
