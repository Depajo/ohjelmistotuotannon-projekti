"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const fsPromise = __importStar(require("fs/promises"));
const dotenv_1 = __importDefault(require("dotenv"));
const start = Date.now();
dotenv_1.default.config();
var connection = mysql_1.default.createConnection({
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
let args = process.argv.slice(2);
let streets = [];
let postalCodes = new Map();
async function readFile() {
    const file = await fsPromise.open(`./resources/${args[0]}`, "r");
    for await (const line of file.readLines()) {
        let lineSplit = line.split(",");
        streets.push({
            region_id: +lineSplit[0],
            munincipality: +lineSplit[1],
            street: lineSplit[2],
            streetNumber: lineSplit[3],
            postalCode: lineSplit[4],
            lat: +lineSplit[5],
            lon: +lineSplit[6]
        });
        postalCodes.set(lineSplit[4], {
            postalCode: lineSplit[4],
            munincipality: +lineSplit[1]
        });
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
            const seconds = (step2 - start) / 1000;
            console.log("Kunta done!");
            console.log(`Time elapsed ${Math.floor((seconds / 60) % 60)} minutes and ${(seconds % 60).toFixed(2)} seconds`);
        });
        const queryPromises = [];
        postalCodes.forEach((item) => {
            const postalPromise = new Promise((resolve, reject) => {
                connection.query("INSERT INTO alue SET postinumero = ?, kunta_id = ?", [item.postalCode, item.munincipality], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            });
            queryPromises.push(postalPromise);
        });
        Promise.all(queryPromises).then(() => {
            const step3 = Date.now();
            const seconds = (step3 - start) / 1000;
            console.log("Alue done!");
            console.log(`Time elapsed ${Math.floor((seconds / 60) % 60)} minutes and ${(seconds % 60).toFixed(2)} seconds`);
            queryPromises.length = 0;
            streets.forEach((item) => {
                const selectQuery = "SELECT alue_id FROM alue WHERE alue.postinumero = ?";
                const insertQuery = "INSERT INTO katutiedot SET alue_id = ?, katu = ?, katunumero = ?, latitude = ?, longitude = ?";
                const insertParams = [item.street, item.streetNumber, item.lat, item.lon];
                const streetPromise = new Promise((resolve, reject) => {
                    connection.query(selectQuery, item.postalCode, (selectError, selectResults) => {
                        if (selectError) {
                            reject(selectError);
                        }
                        else {
                            let areaNumber = selectResults[0].alue_id;
                            insertParams.unshift(areaNumber);
                            connection.query(insertQuery, insertParams, (insertError, insertResults) => {
                                if (insertError) {
                                    reject(insertError);
                                }
                                else {
                                    resolve(insertResults);
                                }
                            });
                        }
                    });
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
