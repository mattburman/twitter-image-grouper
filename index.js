// Twit streaming broken on 6.x node, using 4.4.7

const Twit = require('twit');
var Clarifai = require('clarifai');
const EXAMPLE_IMAGE = 'http://www.newyorker.com/wp-content/uploads/2016/01/Borowitz-Donald-Trump-1200.jpg';

const bot = new Twit({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token:	process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

console.log(process.argv[2]);
const stream = bot.stream('statuses/filter', { track: process.argv[2] });

stream.on('tweet', tweet => {
	// console.log(tweet.entities.media);
	if (!tweet.entities.media || !tweet.entities.media[0]) return; // no image in tweet

	predict(tweet.entities.media[0].media_url_https, (err, res) => {
    //console.log(res.map(el => el.name));
		console.log(res[0].name + ': ' + tweet.entities.media[0].media_url_https);
	});
});

var clarifai = new Clarifai.App(
  process.env.CLARIFAI_CLIENT_ID,
  process.env.CLARIFAI_CLIENT_SECRET
);

function predict(url, cb) {
	clarifai
		.models
		.predict(Clarifai.GENERAL_MODEL, url)
		.then(res => cb(null, res.data.outputs[0].data.concepts))
		.catch(err => cb(err));
}

// predict(EXAMPLE_IMAGE, (err, res) => console.log(res));

