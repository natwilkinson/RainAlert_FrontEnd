var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
const path = require('path');
var pgp = require('pg-promise')(/*options*/)
var db = pgp(process.env.DATABASE_URL)
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Tables
 */
const createTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        name text,
        zip text,
        phone text,
        low text,
        high text,
        rain text,
        snow text
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}
module.exports = {
  createTables
};

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, 'public')));

app.post('/myaction', function(req, res) {
    var boolRain = false;
    var boolSnow = false;
    if (req.body.rain == "rain") { 
      boolRain = true;
    }
    if (req.body.snow == "snow") {
      boolSnow = true;
    }
    const queryText = "INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7);"
    const values = [req.body.name, req.body.zip, req.body.phone, req.body.cold, req.body.hot, boolRain, boolSnow]

  pool.query(queryText, values)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

    console.log('test');
    var response = 'Name: ' + req.body.name + ' Zip: ' + req.body.zip + ' Phone: ' + req.body.phone + ' Low: ' + req.body.cold + ' High: ' + req.body.hot + ' Rain: ' + req.body.rain + ' Snow: ' + req.body.snow
    res.send(response);
});
app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});


app.listen(process.env.PORT || 8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});

