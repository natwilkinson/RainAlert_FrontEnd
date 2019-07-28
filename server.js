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

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/myaction', function(req, res) {
    var rain = false;
    var snow = false;
    if (req.body.rain == "rain") {
      rain = true;
    }
    if (req.body.snow == "snow") {
      snow = true;
    }
    const queryText = 'INSERT INTO public."userData" VALUES($1, $2, $3, $4, $5, $6, $7, $8);'
    //const queryText = 'SELECT * FROM public."userData";'
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

    console.log('test');
    var response = 'Thanks for your information! You will get weather updates by text.'

    res.send(response);
});
app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});


app.listen(process.env.PORT || 8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});
