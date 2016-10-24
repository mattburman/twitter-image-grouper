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

stream.on('tweet', tweet => console.log(tweet.text));

var clarifai = new Clarifai.App(
  process.env.CLARIFAI_CLIENT_ID,
  process.env.CLARIFAI_CLIENT_SECRET
);

clarifai
	.models
	.predict(Clarifai.GENERAL_MODEL, EXAMPLE_IMAGE)
	.then(res => console.log(res.data.outputs[0].data.concepts))
	.catch(err => console.log('err: ', err));


