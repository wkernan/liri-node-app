var spotify = require('spotify');
var request = require('request');
var argOne = process.argv[2];
var argTwo = process.argv[3];

function findTrack() {
	spotify.search({ type: 'track', query: argTwo }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    } else {
	    	console.log(data);
	    	console.log(data.tracks.items.length);
	    	if(data.tracks.items.length > 0) {
	    		console.log('Searching Spotify for ' + argTwo + '\n')
	    		console.log('Artist name: ' + data.tracks.items[0].artists[0].name);
	    		console.log('Song: ' + data.tracks.items[0].name);
	    		console.log('Link: ' + data.tracks.items[0].external_urls.spotify);
	    		console.log('Album: ' + data.tracks.items[0].album.name);
	    	} else {
	    		console.log("I couldn't find the track you are looking for so here's the info for 'What's my age again' by Blink 182 \n");
	    		spotify.search({ type: 'track', query: "What's my age again" }, function(err, data) {
	    			if ( err ) {
	    				console.log('Error occurred: ' + err);
	    				return;
	    			} else {
		  				console.log('Artist name: ' + data.tracks.items[0].artists[0].name);
			    		console.log('Song: ' + data.tracks.items[0].name);
			    		console.log('Link: ' + data.tracks.items[0].external_urls.spotify);
			    		console.log('Album: ' + data.tracks.items[0].album.name);
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
	  	console.log('Movie Title: ' + data.Title);
	  	console.log('Release Year: ' + data.Year);
	  	console.log('IMDB Rating ' + data.imdbRating);
	  	console.log('Country: ' + data.Country);
	  	console.log('Language: ' + data.Language);
	  	console.log('Plot: ' + data.Plot);
	  	console.log('Actors: ' + data.Actors);
	  	//console.log('Rotten Tomatoes Rating: ' + )
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
	  		}
	  	})
	  }
	})
}

switch(argOne) {
	case 'spotify-this-song':
		findTrack()
		break;
	case 'movie-this':
		findMovie()
		break;
}