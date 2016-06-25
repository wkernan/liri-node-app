var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var keys = require('./keys');
var twitter = require('twitter');
var client = new twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});
var argOne = process.argv[2];
var argTwo = process.argv[3];
var count = 0;

function findTweets() {
	fs.appendFile("log.txt", "My Last 20 Tweets\n");
	client.get('statuses/user_timeline', {count: 20}, function(error, tweets, response) {
		if(error) throw error;
		//console.log(tweets);
		tweets.forEach(function(tweet) {
			count++;
			console.log(count + ': ' + tweet.text + '\n');
			fs.appendFile("log.txt", count + ': ' + tweet.text + '\n', function(err) {
				if (err) throw err;
			})
		})
		fs.appendFile("log.txt", "=========================================================================================================\n", function(err) {
			if (err) throw err;
		})
		console.log('Saved to log.txt');
	})
}

function findTrack() {
	spotify.search({ type: 'track', query: argTwo }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    } else {
	    	if(data.tracks.items.length > 0) {
	    		console.log('Searching Spotify for ' + argTwo + '\n')
	    		console.log('Artist name: ' + data.tracks.items[0].artists[0].name);
	    		console.log('Song: ' + data.tracks.items[0].name);
	    		console.log('Link: ' + data.tracks.items[0].external_urls.spotify);
	    		console.log('Album: ' + data.tracks.items[0].album.name);
	    		fs.appendFile("log.txt", "Spotify Search for track: '" + argTwo + "'\n" + 'Artist name: ' + data.tracks.items[0].artists[0].name + '\n' + 'Song: ' + data.tracks.items[0].name + '\n' + 'Link: ' + data.tracks.items[0].external_urls.spotify + '\n' + 'Album: ' + data.tracks.items[0].album.name + '\n=========================================================================================================\n', function (err) {
	    			if(err) throw err;
	    			console.log('Saved to log.txt');
	    		})
	    	} else {
	    		console.log("I couldn't find the track: '" + argTwo + "' so here's the info for 'What's my age again' by Blink 182 \n");
	    		spotify.search({ type: 'track', query: "What's my age again" }, function(err, data) {
	    			if ( err ) {
	    				console.log('Error occurred: ' + err);
	    				return;
	    			} else {
		  				console.log('Artist name: ' + data.tracks.items[0].artists[0].name);
			    		console.log('Song: ' + data.tracks.items[0].name);
			    		console.log('Link: ' + data.tracks.items[0].external_urls.spotify);
			    		console.log('Album: ' + data.tracks.items[0].album.name);
			    		fs.appendFile("log.txt", "Spotify search for track: '" + argTwo + "' was not available, so searched: 'What's My Age Again' instead\n" + 'Artist name: ' + data.tracks.items[0].artists[0].name + '\n' + 'Song: ' + data.tracks.items[0].name + '\n' + 'Link: ' + data.tracks.items[0].external_urls.spotify + '\n' + 'Album: ' + data.tracks.items[0].album.name + '\n=========================================================================================================\n', function (err) {
	    					if(err) throw err;
	    					console.log('Saved to log.txt');
	    				})
	    			}
	    		})
	    	}
	    }
	});
}

function findMovie() {
	request('http://www.omdbapi.com/?t=' + argTwo + '&plot=short&r=json', function (error, response, body) {
		var data = JSON.parse(body);
	  if (data.Response == 'True') {
	  	console.log("Searching OMDB database for '" + argTwo + "'\n");
	  	console.log('Movie Title: ' + data.Title);
	  	console.log('Release Year: ' + data.Year);
	  	console.log('IMDB Rating ' + data.imdbRating);
	  	console.log('Country: ' + data.Country);
	  	console.log('Language: ' + data.Language);
	  	console.log('Plot: ' + data.Plot);
	  	console.log('Actors: ' + data.Actors);
	  	//console.log('Rotten Tomatoes Rating: ' + )
	  	fs.appendFile("log.txt", "OMDB search for movie: '" + argTwo + "'\n" + 'Movie Title: ' + data.Title + '\n' + 'Release Year: ' + data.Year + '\n' + 'IMDB Rating: ' + data.imdbRating + '\n' + 'Country: ' + data.Country + '\n' + 'Language: ' + data.Language + '\n' + 'Plot: ' + data.Plot + '\n' + 'Actors: ' + data.Actors + '\n=========================================================================================================\n', function (err) {
				if(err) throw err;
				console.log('Saved to log.txt');
			})
	  } else {
	  	request('http://www.omdbapi.com/?t=mr.nobody&plot=short&r=json', function (error, response, body) {
	  		if (!error && response.statusCode == 200) {
	  			var data = JSON.parse(body);
	  			console.log("I couldn't find the movie you are looking for so here's the info for 'Mr. Nobody' \n");
			  	console.log('Movie Title: ' + data.Title);
			  	console.log('Release Year: ' + data.Year);
			  	console.log('IMDB Rating ' + data.imdbRating);
			  	console.log('Country: ' + data.Country);
			  	console.log('Language: ' + data.Language);
			  	console.log('Plot: ' + data.Plot);
			  	console.log('Actors: ' + data.Actors);
			  	fs.appendFile("log.txt", "OMDB search for movie: '" + argTwo + "' was not available, so searched: 'Mr.Nobody' instead\n" + 'Movie Title: ' + data.Title + '\n' + 'Release Year: ' + data.Year + '\n' + 'IMDB Rating: ' + data.imdbRating + '\n' + 'Country: ' + data.Country + '\n' + 'Language: ' + data.Language + '\n' + 'Plot: ' + data.Plot + '\n' + 'Actors: ' + data.Actors + '\n=========================================================================================================\n', function (err) {
						if(err) throw err;
						console.log('Saved to log.txt');
					})
	  		}
	  	})
	  }
	})
}

function doIt() {
	fs.readFile("random.txt", "utf8", function(err, data) {
		var dataArr = data.split(',');
		argOne = dataArr[0];
		argTwo = dataArr[1];
		if(argOne == 'spotify-this-song') {
			findTrack();
		} else if(argOne == 'movie-this') {
			findMovie();
		} else if(argOne == 'my-tweets') {

		}
	})
}

switch(argOne) {
	case 'my-tweets':
		findTweets()
		break;
	case 'spotify-this-song':
		findTrack()
		break;
	case 'movie-this':
		findMovie()
		break;
	case 'do-what-it-says':
		doIt()
		break;
	default:
		console.log('Please enter one of the following commands after node liri.js\n 1. to see my latest 20 tweets input: my-tweets\n 2. to search for a song input: spotify-this-song\n 3. to search for a movie input: movie-this\n 4. to run from random.txt input: do-what-it-says');
}