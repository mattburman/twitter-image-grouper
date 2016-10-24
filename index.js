// Twit broken on 6.x node, using 4.4.7

const Twit = require('twit');

const bot = new Twit({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token:	process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

console.log(process.argv[2]);
const stream = bot.stream('statuses/filter', { track: process.argv[2] });

stream.on('tweet', tweet => console.log(tweet.text));

