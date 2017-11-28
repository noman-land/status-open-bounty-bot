
const express = require('express');
const Twitter = require('twitter');

const { getActivity, getBounties, keepAlive } = require('./utils/ajax');
const { POLL_FREQUENCY } = require('./utils/constants');
const { activityToMessage, bountyToMessage } = require('./utils/utils');

const app = express();

const {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_SECRET,
  CONSUMER_KEY,
  CONSUMER_SECRET,
  PORT,
} = process.env;

const client = new Twitter({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token_key: ACCESS_TOKEN_KEY,
  access_token_secret: ACCESS_TOKEN_SECRET,
});

let lastPostedActivity = {
  updated: new Date(),
};

let lastPostedBounty = {
  updated: new Date(),
};

app.get("/", (request, response) => response.send('TestBoyBot is running.'));

function postTweet(message) {
  return new Promise((resolve, reject) => {
    client.post('statuses/update', { status: message },  function(error, tweet, response) {
      if (error) reject(error);
      console.log('Posted:', message);
      resolve(tweet);
    });
  });
}

const filterNew = lastActivity => activities => {
  return activities.filter(activity => new Date(activity.updated) > new Date(lastActivity.updated));
};

function fetchAndTweet() {
  getBounties()
    .then(filterNew(lastPostedBounty))
    .then(newBounties => {
      const newBountiesLength = newBounties.length;
      console.log('New bounties:', newBountiesLength, '\n', newBounties);
      if (!newBountiesLength) {
        return;
      }

      return new Promise((resolve, reject) => {
        return resolve(newBounties.map(bounty => {
          if (!parseFloat(bounty.valueUsd, 10)) {
            lastPostedBounty = bounty;
            return bounty;
          }
          const message = bountyToMessage(bounty);
          return postTweet(message).then(tweet => {
            lastPostedBounty = bounty;
            console.log('Posted', newBountiesLength, 'new bounties at', lastPostedBounty.updated);
            return tweet;
          }).catch(error => console.error('Problem posting tweet', message, error));
        }));
      })
      .catch(error => console.error('Problem posting tweets:', error));
    })
    .catch(error => console.error(error));

  getActivity()
    .then(filterNew(lastPostedActivity))
    .then(newActivities => {
      const newActivitiesLength = newActivities.length;
      console.log('New activities:', newActivitiesLength, '\n', newActivities);
      if (!newActivitiesLength) {
        return;
      }

      return new Promise((resolve, reject) => {
        return resolve(newActivities.map(activity => {
          const message = activityToMessage(activity);
          return postTweet(message).then(tweet => {
            console.log('Posted', newActivitiesLength, 'new activities.');
            lastPostedActivity = activity;
            console.log('New lastPostedActivity set at', lastPostedActivity.updated);
            return tweet;
          }).catch(error => console.error('Problem posting tweet', message, error));
        }));
      })
      .catch(error => console.error('Problem posting tweets:', error));
    })
    .catch(error => console.error(error));
}

const listener = app.listen(PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);

  fetchAndTweet();
  setInterval(() => {
    fetchAndTweet();
    //keepAlive();
  }, POLL_FREQUENCY);
});
