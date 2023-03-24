import mysql from "mysql";
import * as fsPromise from "fs/promises";

type Data = {
    region_id: number;
    munincipality: number;
    street: string;
    street_number: string;
    lat: number;
    lon: number;
}

var connection = mysql.createConnection({
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

var query : string = "TÄHÄN SQL-QUERY";

// connection.query(query, [data.region_id, data.munincipality, data.street, data.lat, data.lon], (err, result) => {
//     if (err) {
//         console.log(err);
//         return;
//     } else {
//         console.log(result);
//     }
// });