const mysql = require('mysql2');
const { promisify } = require("util");
const connection = mysql.createConnection({
    host     : '34.101.106.231',
    user     : 'root',
    password : 'kuma123',
    database : 'db-kuma'
})
connection.connect((err) => {
    if(!err) {
        console.log("Database is connected!");
    } else {
        console.log("Error connecting database!");
    }
    });

connection.query =promisify(connection.query);

module.exports = connection;


