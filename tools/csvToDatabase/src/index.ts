import mysql from "mysql";
import * as fsPromise from "fs/promises";
import dotenv from "dotenv";

const start = Date.now();

interface Data {
    region_id: number;
    munincipality: number;
    street: string;
    streetNumber: string;
    postalCode: string;
    lat: number;
    lon: number;
}

interface Postal {
    postalCode: string;
    munincipality: number;
}

dotenv.config();
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.log("err connecting: " + err.stack);
        return;
    }
    console.log("Connected");
});

let args: string[] = process.argv.slice(2);
let streets: Data[] = [];
let postalCodes = new Map<string, Postal>();

async function readFile() {
    const file = await fsPromise.open(`./resources/${args[0]}`, "r");
    for await (const line of file.readLines()) {
        let lineSplit : string[] = line.split(",");
        streets.push({
            region_id: +lineSplit[0],
            munincipality: +lineSplit[1],
            street: lineSplit[2],
            streetNumber: lineSplit[3],
            postalCode: lineSplit[4],
            lat: +lineSplit[5],
            lon: +lineSplit[6]
        });
        postalCodes.set(
            lineSplit[4], {
                postalCode: lineSplit[4], 
                munincipality: +lineSplit[1]
            }
        );
    }
}

readFile().then(() => {
    connection.beginTransaction((err) => {
        if (err) {
            throw err;
        }
        connection.query("INSERT INTO maakunta SET aluenumero = ?, maakunta = ?", [streets[0].region_id, args[1]], (error, results) => {
            if (error) {
                return connection.rollback(() => {
                    throw error;
                });
            }
            const step1 = Date.now();
            const seconds = (step1 - start) / 1000; 
            console.log("Maakunta done!");
            console.log(`Time elapsed ${Math.floor((seconds / 60) % 60)} minutes and ${(seconds % 60).toFixed(2)} seconds`);
        });

        connection.query("INSERT INTO kunta SET kunta_id = ?, aluenumero = ?, kunta = ?", [streets[0].munincipality, streets[0].region_id, args[2]], (error, results) => {
            if (error) {
                return connection.rollback(() => {
                    throw error;
                });
            }
            const step2 = Date.now();
            const seconds: number = (step2 - start) / 1000;
            console.log("Kunta done!");
            console.log(`Time elapsed ${Math.floor((seconds / 60) % 60)} minutes and ${(seconds % 60).toFixed(2)} seconds`);
        });

        const queryPromises : Promise<any>[] = [];

        postalCodes.forEach((item) => {
            const postalPromise = new Promise((resolve, reject) => {
                connection.query("INSERT INTO alue SET postinumero = ?, kunta_id = ?", [item.postalCode, item.munincipality], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
            queryPromises.push(postalPromise);
        });

        Promise.all(queryPromises).then(() => {
            const step3 = Date.now();
            const seconds: number = (step3 - start) / 1000;
            console.log("Alue done!");
            console.log(`Time elapsed ${Math.floor((seconds / 60) % 60)} minutes and ${(seconds % 60).toFixed(2)} seconds`);
            queryPromises.length = 0;
            streets.forEach((item) => {
                const selectQuery = "SELECT alue_id FROM alue WHERE alue.postinumero = ?";
                const insertQuery = "INSERT INTO katutiedot SET alue_id = ?, katu = ?, katunumero = ?, latitude = ?, longitude = ?"
                const insertParams = [item.street, item.streetNumber, item.lat, item.lon];

                const streetPromise = new Promise((resolve, reject) => {
                    connection.query(selectQuery , item.postalCode, (selectError, selectResults) => {
                            if (selectError) {
                                reject(selectError);
                            } else {
                                let areaNumber: number = selectResults[0].alue_id;
                                insertParams.unshift(areaNumber);
                                connection.query(insertQuery, insertParams, (insertError, insertResults) => {
                                    if (insertError) {
                                        reject(insertError);
                                    } else {
                                        resolve(insertResults);
                                    }
                                });
                            }
                        }
                    );
                });
                queryPromises.push(streetPromise);
            });

            Promise.all(queryPromises).then(() => {
                connection.commit((error) => {
                    if (error) {
                        connection.rollback(() => {
                            throw error;
                        });
                    }
                    console.log("Katutiedot done!");
                    connection.end();
                    const end = Date.now();
                    const seconds = end - start / 1000;
                    console.log(`Time elapsed ${Math.floor((seconds / 60) % 60)} minutes and ${(seconds % 60).toFixed(2)} seconds`);
                });
            }).catch((e) => {
                if (e) {
                    connection.rollback(() => {
                        throw e;
                    });
                }
            });
        }).catch((e) => {
            if (e) {
                connection.rollback(() => {
                    throw e;
                });
            }
        });
    });
});