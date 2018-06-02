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

/* POST new Artist and ID page */
router.get('/artistsForm', (req, res) => {
    res.render('artistsForm');
});

router.post('/artistsForm', (req, res) => {
    const query = `INSERT into Artist(ArtistId, Name) VALUES(${req.body.artistId}, "${req.body.name}")`;
    db.run(query, (err, row) => {
        if (err) throw err;
        else {
            res.redirect(303, '/artists');
            router.get('/artists', (req, res) => {
                const query2 = `SELECT ArtistId, Name from Artist LIMIT 1000`;
                let resultsArray = [];
                db.each(query2, (err, row) => {
                    if (err) throw err;
                    resultsArray.push(row);
                });
                res.render('artists', {results: resultsArray});
            });
        }   
    });
});

// POST songs by length
router.get('/lengthForm', (req, res) => {
    res.render('lengthForm');
});

router.post('/lengthForm', (req, res) => {
    const minutes = req.body.mins,
        seconds = req.body.secs,
        millisecs = (parseInt(minutes) * 60 + parseInt(seconds)) * 1000,
        query = `SELECT Name, Milliseconds FROM Track WHERE Milliseconds > ${millisecs} LIMIT 1000`;
        console.log(query)
    db.run(query, (err, tracks) => {
        if (err) throw err;
        else {
            res.redirect(303, '/length');
            router.get('/length', (req, res) => {
                let tracksArray = [];
                db.each(query, (err, tracks) => {
                    if (err) throw err;
                    // turns milliseconds back to mins and secs
                    const min = Math.floor(tracks.Milliseconds / 60000);
                    const sec = ((tracks.Milliseconds % 60000) / 1000).toFixed(0);
                    tracks.Milliseconds = `${min}:${sec}`;
                    //
                    tracksArray.push(tracks);
                });
                res.render('length', {results: tracksArray});
            });
        }
    });
});

module.exports = router;
