// This is the Node server that listens for get request
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
const path = require('path');

// opening connection to the database
var pgp = require('pg-promise')()
var db = pgp(process.env.DATABASE_URL)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// connects to database
pool.on('connect', () => {
  console.log('connected to the db');
});

// lisens on port set as environment variable or on 8080
app.listen(process.env.PORT || 8080, function() {
    console.log('Server running');
  });


// response for homepage
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/index.html'));
  });

// Parse information from form and sets variables
app.use(bodyParser.urlencoded({ extended: true })); //for reading info from form
app.use(express.static(path.join(__dirname, 'public'))); //for displaying CSS
app.post('/myaction', function(req, res) {
    var rain = false;
    var snow = false;
    if (req.body.rain == "rain") {
      rain = true;
    }
    if (req.body.snow == "snow") {
      snow = true;
    }

// Creates query to send form data to database
    const queryText = 'INSERT INTO public."userData" VALUES($1, $2, $3, $4, $5, $6, $7, $8);'
    const values = [req.body.zip, req.body.cold, req.body.hot, rain, snow, null, req.body.name, req.body.phone]
  pool.query(queryText, values)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });


// Displays response to user to let them know that their info was submitted
    var response = 'Thanks for your information! You will get weather updates by text.'
    res.send(response);
});
