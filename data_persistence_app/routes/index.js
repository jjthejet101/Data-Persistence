var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./Chinook_Sqlite_AutoIncrementPKs.sqlite');

const query = `SELECT * from Artist LIMIT 100`;

db.each(query, (err, row) => {
  if (err) throw err;
  console.log(row);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Data Persistence App' });
});

/* Albums home page. */
router.get('/albums', function(req, res, next) {
  res.render('albums', {});
});

module.exports = router;
