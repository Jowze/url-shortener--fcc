const express = require('express');
const mongo = require('mongodb').MongoClient;
const crypto = require('crypto');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const path = require('path');
const app = express();

function checkHex(req, res, db, shortString) {
	db
		.collection('urls')
		.find({ shortened: shortString }, { _id: 1 })
		.toArray(function(err, results) {
			if (results.length > 0) {
				console.log('collision');
				let newShort = getShortHex();
				checkHex(req, db, newShort);
			} else {
				insertDB(req, res, db, shortString);
			}
		});
}

function getShortHex() {
	return crypto.randomBytes(5).toString('hex');
}

function insertDB(req, res, db, shortString) {
	const appDir = path.dirname(require.main.filename);
	const urlDB = { url: req.params.url, shortened: shortString };
	const urlRes = {
		url: req.params.url,
		shortened: req.protocol + '://' + req.get('host') + '/' + shortString,
	};

	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(urlRes));
	db.collection('urls').insert(urlDB);
 
}

mongo.connect(process.env.MONGODB_URI, (err, client) => {
	if (err) return console.log(err);
	const db = client.db('urlshortener');

	app.listen(3000, function() {
		console.log('listening');
	});

	app.get('/new/:url(*)', (req, res) => {
		if (validUrl.isUri(req.params.url)) {
			let shortString = getShortHex();
			checkHex(req, res, db, shortString);
		} else {
			let errorRes = {
				error:
					'Wrong url format, make sure you have a valid protocol and real site',
			};
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(errorRes));
		}
	});

	app.get('/:url', function(req, res) {
		db
			.collection('urls')
			.find({
				shortened: req.params.url,
			})
			.toArray(function(err, results) {
				if (err) return console.log(err);
				else if (results.length == 0) {
					let errorRes = {
						error: 'this url is not on the database',
					};
					res.setHeader('Content-Type', 'application/json');
					res.send(JSON.stringify(errorRes));
				} else {
					res.redirect(results[0].url);
				}
    
			});
	});
  
  app.get("/", function(req,res){
    const defaultPage = "Hello, thanks for visiting this page made as part of the freecodecamp.org curriculum <br> To test, send request to https://url-shortener--fcc.glitch.me/new/[INSERT URL HERE]<br> to navigate to that url visit https://url-shortener--fcc.glitch.me/[INSERT SHORTENED URL CODE HERE]";
    res.send(defaultPage);
  });
});
