"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
var connection = mysql_1.default.createConnection({
    host: "mydb.tamk.fi",
    user: "cgotky",
    password: "d4t4B4s3"
});
connection.connect((err) => {
    if (err) {
        console.log("err connecting: " + err.stack);
        return;
    }
    console.log("Connected");
});
var query = "TÄHÄN SQL-QUERY";
// connection.query(query, [data.region_id, data.munincipality, data.street, data.lat, data.lon], (err, result) => {
//     if (err) {
//         console.log(err);
//         return;
//     } else {
//         console.log(result);
//     }
// });
