var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var keys = require('./keys');
var twitter = require('twitter');
var colors = require('colors');
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
var now = new Date();

function getTime() {
	var hour = now.getHours();
	var min = now.getMinutes();
	var sec = now.getSeconds();
	if(hour > 12) {
		hour = hour - 12;
		if(sec < 10) {
			sec = '0' + sec;
		}
		if(min < 10) {
			min = '0' + min;
		}
		return (hour + ':' + min + ':' + sec + 'pm').bgYellow;
	} else {
		if(sec < 10) {
			sec = '0' + sec;
		}
		if(min < 10) {
			min = '0' + min;
		}
		return (hour + ':' + min + ':' + sec + 'am').bgYellow;
	}
}

function getTimeText() {
	var hour = now.getHours();
	var min = now.getMinutes();
	var sec = now.getSeconds();
	if(hour > 12) {
		hour = hour - 12;
		if(sec < 10) {
			sec = '0' + sec;
		}
		if(min < 10) {
			min = '0' + min;
		}
		return hour + ':' + min + ':' + sec + 'pm ';
	} else {
		if(sec < 10) {
			sec = '0' + sec;
		}
		if(min < 10) {
			min = '0' + min;
		}
		return hour + ':' + min + ':' + sec + 'am ';
	}
}

function findTweets() {
	fs.appendFile("log.txt", getTimeText() + "My Last 20 Tweets\n");
	client.get('statuses/user_timeline', {count: 20}, function(error, tweets, response) {
		if(error) throw error;
		console.log(getTime() + ' Showing last 20 tweets\n');
		tweets.forEach(function(tweet) {
			count++;
			console.log(colors.blue(count) + ': ' + tweet.text + '\n');
			fs.appendFile("log.txt", count + ': ' + tweet.text + '\n', function(err) {
				if (err) throw err;
			})
		})
		fs.appendFile("log.txt", "=========================================================================================================\n", function(err) {
			if (err) throw err;
		})
		console.log('Saved to log.txt'.bgGreen);
	})
}

function findTrack() {
	if(argStr == '') {
		console.log(getTime() + ' Please enter a song for me to search for'.red);
	} else {
		spotify.search({ type: 'track', query: argStr }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    } else {
		    	if(data.tracks.items.length > 0) {
		    		console.log(getTime() + " Searching Spotify for '" + colors.green(argStr) + "'\n");
		    		console.log('Artist name: '.blue + data.tracks.items[0].artists[0].name);
		    		console.log('Song: '.blue + data.tracks.items[0].name);
		    		console.log('Link: '.blue + data.tracks.items[0].external_urls.spotify);
		    		console.log('Album: '.blue + data.tracks.items[0].album.name);
		    		fs.appendFile("log.txt", getTimeText() + "Spotify Search for track: '" + argStr + "'\n" + 'Artist name: ' + data.tracks.items[0].artists[0].name + '\n' + 'Song: ' + data.tracks.items[0].name + '\n' + 'Link: ' + data.tracks.items[0].external_urls.spotify + '\n' + 'Album: ' + data.tracks.items[0].album.name + '\n=========================================================================================================\n', function (err) {
		    			if(err) throw err;
		    			console.log('Saved to log.txt'.bgGreen);
		    		})
		    	} else {
		    		console.log(getTime() + " I couldn't find the track: '" + colors.green(argStr) + "' so here's the info for 'What's my age again' by Blink 182 \n");
		    		spotify.search({ type: 'track', query: "What's my age again" }, function(err, data) {
		    			if ( err ) {
		    				console.log('Error occurred: ' + err);
		    				return;
		    			} else {
			  				console.log('Artist name: '.blue + data.tracks.items[0].artists[0].name);
				    		console.log('Song: '.blue + data.tracks.items[0].name);
				    		console.log('Link: '.blue + data.tracks.items[0].external_urls.spotify);
				    		console.log('Album: '.blue + data.tracks.items[0].album.name);
				    		fs.appendFile("log.txt", getTimeText() + "Spotify search for track: '" + colors.green(argStr) + "' was not available, so searched: 'What's My Age Again' instead\n" + 'Artist name: ' + data.tracks.items[0].artists[0].name + '\n' + 'Song: ' + data.tracks.items[0].name + '\n' + 'Link: ' + data.tracks.items[0].external_urls.spotify + '\n' + 'Album: ' + data.tracks.items[0].album.name + '\n=========================================================================================================\n', function (err) {
		    					if(err) throw err;
		    					console.log('Saved to log.txt'.bgGreen);
		    				})
		    			}
		    		})
		    	}
		    }
		});
	}
}

function findMovie() {
	if(argStr == '') {
		console.log(getTime() + ' Please enter a movie for me to search for'.red);
	} else {
		request('http://www.omdbapi.com/?t=' + argStr + '&plot=short&tomatoes=true&r=json', function (error, response, body) {
			var data = JSON.parse(body);
		  if (data.Response == 'True') {
		  	console.log(getTime() + " Searching OMDB database for '" + colors.green(argStr) + "'\n");
		  	console.log('Movie Title: '.blue + data.Title);
		  	console.log('Release Year: '.blue + data.Year);
		  	console.log('IMDB Rating: '.blue + data.imdbRating);
		  	console.log('Rotten Tomatoes Rating: '.blue + data.tomatoMeter + '%');
		  	console.log('Rotten Tomatoes Link: '.blue + data.tomatoURL);
		  	console.log('Country: '.blue + data.Country);
		  	console.log('Language: '.blue + data.Language);
		  	console.log('Plot: '.blue + data.Plot);
		  	console.log('Actors: '.blue + data.Actors);
		  	//console.log('Rotten Tomatoes Rating: ' + )
		  	fs.appendFile("log.txt", getTimeText() + "OMDB search for movie: '" + argStr + "'\n" + 'Movie Title: ' + data.Title + '\n' + 'Release Year: ' + data.Year + '\n' + 'IMDB Rating: ' + data.imdbRating + '\n' + 'Rotten Tomatoes Rating: ' + data.tomatoMeter + '%\n' + 'Rotten Tomatoes Link: ' + data.tomatoURL + '\n' + 'Country: ' + data.Country + '\n' + 'Language: ' + data.Language + '\n' + 'Plot: ' + data.Plot + '\n' + 'Actors: ' + data.Actors + '\n=========================================================================================================\n', function (err) {
					if(err) throw err;
					console.log('Saved to log.txt'.bgGreen);
				})
		  } else {
		  	request('http://www.omdbapi.com/?t=mr.nobody&tomatoes=true&plot=short&r=json', function (error, response, body) {
		  		if (!error && response.statusCode == 200) {
		  			var data = JSON.parse(body);
		  			console.log(getTime() + " I couldn't find the movie: '" + colors.green(argStr) + "' so here's the info for 'Mr. Nobody' \n");
				  	console.log('Movie Title: '.blue + data.Title);
				  	console.log('Release Year: '.blue + data.Year);
				  	console.log('IMDB Rating '.blue + data.imdbRating);
				  	console.log('Country: '.blue + data.Country);
				  	console.log('Language: '.blue + data.Language);
				  	console.log('Plot: '.blue + data.Plot);
				  	console.log('Actors: '.blue + data.Actors);
				  	fs.appendFile("log.txt", getTimeText() + "OMDB search for movie: '" + argStr + "' was not available, so searched: 'Mr.Nobody' instead\n" + 'Movie Title: ' + data.Title + '\n' + 'Release Year: ' + data.Year + '\n' + 'IMDB Rating: ' + data.imdbRating + '\n' + 'Country: ' + data.Country + '\n' + 'Language: ' + data.Language + '\n' + 'Plot: ' + data.Plot + '\n' + 'Actors: ' + data.Actors + '\n=========================================================================================================\n', function (err) {
							if(err) throw err;
							console.log('Saved to log.txt'.bgGreen);
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
			console.log(getTime() + ' There is no data in the random.txt file. Please use: new-command, to input a new command to do'.red);
		} else {
			var dataArr = data.split(',');
			argOne = dataArr[0];
			argStr = dataArr[1];
			if(argOne == 'spotify-this-song') {
				fs.appendFile("log.txt", getTimeText() + "Ran do-what-it-says: " + argOne + " '" + argStr + "' command\n");
				findTrack();
			} else if(argOne == 'movie-this') {
				fs.appendFile("log.txt", getTimeText() + "Ran do-what-it-says: " + argOne + " '" + argStr + "' command\n");
				findMovie();
			} else if(argOne == 'my-tweets') {
				fs.appendFile("log.txt", getTimeText() + "Ran do-what-it-says: " + argOne + " command\n");
				findTweets();
			}
		}
	})
}

function newCmd() {
	if(argTwo == undefined && argThree == undefined) {
		console.log(getTime() + " Please input 1 of the 3 options: my-tweets, spotify-this-song or movie-this along with a second search paramater".red);
	} else if(argTwo == 'my-tweets') {
		fs.writeFile("random.txt", argTwo, function(err) {
			if (err) throw err;
			console.log(getTime() + " New command " + colors.green(argTwo) + " has been saved!");
			fs.appendFile("log.txt", getTimeText() + "Ran new-command and added " + argTwo + " to random.txt\n=========================================================================================================\n")
		})
	} else if(argTwo == 'spotify-this-song' && argThree == undefined) {
		console.log(getTime() + ' Please enter a song for me to search for'.red);
	} else if(argTwo == 'movie-this' && argThree == undefined) {
		console.log(getTime() + ' Please enter a movie for me to search for'.red);
	} else {
		fs.writeFile("random.txt", argTwo + "," + newCmdArgStr, function(err) {
			if (err) throw err;
			console.log(getTime() + " New command " + colors.green(argTwo) + ", '" + newCmdArgStr + "' has been saved!");
			fs.appendFile("log.txt", getTimeText() + "Ran new-command and added " + argTwo + ", '" + newCmdArgStr + "' to random.txt\n=========================================================================================================\n")
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
		console.log(getTime() + ' Please enter one of the following commands after node liri.js\n 1. to see my latest 20 tweets input: my-tweets\n 2. to search for a song input: spotify-this-song\n 3. to search for a movie input: movie-this\n 4. to run from random.txt input: do-what-it-says\n 5. to create a new command in random.txt input: new-command, and add 1 of the 3 options - my-tweets, spotify-this-song or movie-this');
}