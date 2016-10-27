// Twit streaming broken on 6.x node, using 4.4.7

const Twit = require('twit');
const Clarifai = require('clarifai');
const EXAMPLE_IMAGE = 'http://www.newyorker.com/wp-content/uploads/2016/01/Borowitz-Donald-Trump-1200.jpg';
const DEFAULT_DIR = 'img';
const dir = (process.argv[3] || DEFAULT_DIR);
const dlImg = require('image-downloader');
const path = require('path');

console.log(process.argv);
console.log(dir);
require('shelljs/global'); // import shelljs for mkdir, ls, etc
if (ls().indexOf(dir) === -1) mkdir(dir);

const bot = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token:	process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

console.log(process.argv[2]);
const stream = bot.stream('statuses/filter', { track: process.argv[2] });
stream.on('error', err => console.log(err));

stream.on('tweet', tweet => {
  if (tweet.retweeted || !tweet.entities.media || !tweet.entities.media[0]) return; // no image in tweet

  // console.log(tweet.entities.media[0].media_url_https);

  predict(tweet.entities.media[0].media_url_https, (err, res) => {
    if (err) console.log(err);
    const newDir = dir + '/' + res[0].name;
    if (ls(dir).indexOf(res[0].name) === -1) mkdir(newDir);

    dlImg({
    url: tweet.entities.media[0].media_url_https,
      dest: path.join(__dirname, newDir) + '/' + res[0].name + '-' + tweet.user.screen_name + '.jpg',
      done: (err, filename, image) => {
        if (err) console.log(err);
        console.log('Image at: ' + filename);
      }
    });
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

