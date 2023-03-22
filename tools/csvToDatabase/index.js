var mysql = require("mysql");
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

    console.log("Connected in " + connection.host);
});

var query = "TÄHÄN SQL-QUERY";
var data = {
    region_id: 0,
    munincipality: 0,
    street: "",
    lat: 0,
    lon: 0
};

connection.query(query, [data.region_id, data.munincipality, data.street, data.lat, data.lon], (err, result) => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log(result);
    }
})