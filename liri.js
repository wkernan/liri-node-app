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
var argLength = process.argv.length;
var argArr = process.argv.slice(3);
var newCmdArgArr = process.argv.slice(4);
var argOne = process.argv[2];
var argTwo = process.argv[3];
var argThree = process.argv[4];
var argStr = argArr.join(' ');
var newCmdArgStr = newCmdArgArr.join(' ');
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
//working on checking if user leaves search item blank
function findTrack() {
	if(argStr == undefined) {
		console.log('Please enter a song for me to search for');
	} else {
		spotify.search({ type: 'track', query: argStr }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    } else {
		    	if(data.tracks.items.length > 0) {
		    		console.log("Searching Spotify for '" + argStr + "'\n");
		    		console.log('Artist name: ' + data.tracks.items[0].artists[0].name);
		    		console.log('Song: ' + data.tracks.items[0].name);
		    		console.log('Link: ' + data.tracks.items[0].external_urls.spotify);
		    		console.log('Album: ' + data.tracks.items[0].album.name);
		    		fs.appendFile("log.txt", "Spotify Search for track: '" + argStr + "'\n" + 'Artist name: ' + data.tracks.items[0].artists[0].name + '\n' + 'Song: ' + data.tracks.items[0].name + '\n' + 'Link: ' + data.tracks.items[0].external_urls.spotify + '\n' + 'Album: ' + data.tracks.items[0].album.name + '\n=========================================================================================================\n', function (err) {
		    			if(err) throw err;
		    			console.log('Saved to log.txt');
		    		})
		    	} else {
		    		console.log("I couldn't find the track: '" + argStr + "' so here's the info for 'What's my age again' by Blink 182 \n");
		    		spotify.search({ type: 'track', query: "What's my age again" }, function(err, data) {
		    			if ( err ) {
		    				console.log('Error occurred: ' + err);
		    				return;
		    			} else {
			  				console.log('Artist name: ' + data.tracks.items[0].artists[0].name);
				    		console.log('Song: ' + data.tracks.items[0].name);
				    		console.log('Link: ' + data.tracks.items[0].external_urls.spotify);
				    		console.log('Album: ' + data.tracks.items[0].album.name);
				    		fs.appendFile("log.txt", "Spotify search for track: '" + argStr + "' was not available, so searched: 'What's My Age Again' instead\n" + 'Artist name: ' + data.tracks.items[0].artists[0].name + '\n' + 'Song: ' + data.tracks.items[0].name + '\n' + 'Link: ' + data.tracks.items[0].external_urls.spotify + '\n' + 'Album: ' + data.tracks.items[0].album.name + '\n=========================================================================================================\n', function (err) {
		    					if(err) throw err;
		    					console.log('Saved to log.txt');
		    				})
		    			}
		    		})
		    	}
		    }
		});
	}
}

function findMovie() {
	if(argStr == undefined) {
		console.log('Please enter a movie for me to search for');
	} else {
		request('http://www.omdbapi.com/?t=' + argStr + '&plot=short&r=json', function (error, response, body) {
			var data = JSON.parse(body);
		  if (data.Response == 'True') {
		  	console.log("Searching OMDB database for '" + argStr + "'\n");
		  	console.log('Movie Title: ' + data.Title);
		  	console.log('Release Year: ' + data.Year);
		  	console.log('IMDB Rating ' + data.imdbRating);
		  	console.log('Country: ' + data.Country);
		  	console.log('Language: ' + data.Language);
		  	console.log('Plot: ' + data.Plot);
		  	console.log('Actors: ' + data.Actors);
		  	//console.log('Rotten Tomatoes Rating: ' + )
		  	fs.appendFile("log.txt", "OMDB search for movie: '" + argStr + "'\n" + 'Movie Title: ' + data.Title + '\n' + 'Release Year: ' + data.Year + '\n' + 'IMDB Rating: ' + data.imdbRating + '\n' + 'Country: ' + data.Country + '\n' + 'Language: ' + data.Language + '\n' + 'Plot: ' + data.Plot + '\n' + 'Actors: ' + data.Actors + '\n=========================================================================================================\n', function (err) {
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
				  	fs.appendFile("log.txt", "OMDB search for movie: '" + argStr + "' was not available, so searched: 'Mr.Nobody' instead\n" + 'Movie Title: ' + data.Title + '\n' + 'Release Year: ' + data.Year + '\n' + 'IMDB Rating: ' + data.imdbRating + '\n' + 'Country: ' + data.Country + '\n' + 'Language: ' + data.Language + '\n' + 'Plot: ' + data.Plot + '\n' + 'Actors: ' + data.Actors + '\n=========================================================================================================\n', function (err) {
							if(err) throw err;
							console.log('Saved to log.txt');
						})
		  		}
		  	})
		  }
		})
	}
}

function doIt() {
	fs.readFile("random.txt", "utf8", function(err, data) {
		if(data == "") {
			console.log('There is no data in the random.txt file. Please use: new-command, to input a new command to do');
		} else {
			var dataArr = data.split(',');
			argOne = dataArr[0];
			argStr = dataArr[1];
			if(argOne == 'spotify-this-song') {
				fs.appendFile("log.txt", "Ran do-what-it-says: " + argOne + " '" + argStr + "' command\n");
				findTrack();
			} else if(argOne == 'movie-this') {
				fs.appendFile("log.txt", "Ran do-what-it-says: " + argOne + " '" + argStr + "' command\n");
				findMovie();
			} else if(argOne == 'my-tweets') {
				fs.appendFile("log.txt", "Ran do-what-it-says: " + argOne + " command\n");
				findTweets();
			}
		}
	})
}

function newCmd() {
	if(argTwo == undefined && argThree == undefined) {
		console.log("Please input 1 of the 3 options: my-tweets, spotify-this-song or movie-this along with a second search paramater");
	} else if(argTwo == 'my-tweets') {
		fs.writeFile("random.txt", argTwo, function(err) {
			if (err) throw err;
			console.log("New command " + argTwo + " has been saved!");
			fs.appendFile("log.txt", "Ran new-command and added " + argTwo + " to random.txt\n=========================================================================================================\n")
		})
	} else if(argTwo == 'spotify-this-song' && argThree == undefined) {
		console.log('Please enter a song for me to search for');
	} else if(argTwo == 'movie-this' && argThree == undefined) {
		console.log('Please enter a movie for me to search for');
	} else {
		fs.writeFile("random.txt", argTwo + "," + newCmdArgStr, function(err) {
			if (err) throw err;
			console.log("New Command " + argTwo + ", '" + newCmdArgStr + "' has been saved!");
			fs.appendFile("log.txt", "Ran new-command and added " + argTwo + ", '" + newCmdArgStr + "' to random.txt\n=========================================================================================================\n")
		})
	}
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
	case 'new-command':
		newCmd()
		break;
	default:
		console.log('Please enter one of the following commands after node liri.js\n 1. to see my latest 20 tweets input: my-tweets\n 2. to search for a song input: spotify-this-song\n 3. to search for a movie input: movie-this\n 4. to run from random.txt input: do-what-it-says\n 5. to create a new command in random.txt input: new-command, and add 1 of the 3 options - my-tweets, spotify-this-song or movie-this');
}