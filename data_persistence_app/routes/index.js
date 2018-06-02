var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./Chinook_Sqlite_AutoIncrementPKs.sqlite');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Data Persistence App' });
});

/* Albums page: displays table of the respective artist/album. */
router.get('/albums', function(req, res, next) {
  const query = `SELECT Artist.Name as Artist, Album.Title as Album FROM Artist JOIN Album WHERE Artist.ArtistId=Album.ArtistId LIMIT 1000`;
  let resultsArray = [];
  db.each(query, (err, row) => {
      if (err) throw err;
      // console.log(row);
      resultsArray.push(row);
    });
  res.render('albums', {results: resultsArray});
});

module.exports = router;
