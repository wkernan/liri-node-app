var spotify = require('spotify');
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
	
}

switch(argOne) {
	case 'spotify-this-song':
		findTrack()
		break;
	case 'movie-this':
		findMovie()
		break;
}