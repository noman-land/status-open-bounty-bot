
const express = require('express');
const Twitter = require('twitter');

const { getActivity, getBounties } = require('./utils/ajax');
const { POLL_FREQUENCY } = require('./utils/constants');
const { getLastPostedActivity, setLastPostedActivity } = require('./utils/redisUtils');
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

app.get("/", (request, response) => response.send('TestBoyBot is running.'));

function postTweet(message) {
  return new Promise((resolve, reject) => {
    client.post('statuses/update', { status: message },  function(error, tweet) {
      if (error) reject(error);
      resolve(tweet);
    });
  });
}

const filterNew = lastActivity => activities => {
  console.log('Last posted activity:', lastActivity.updated);
  return activities.filter(activity => new Date(activity.updated) > new Date(lastActivity.updated));
};

function fetchAndTweet() {
  Promise.all([getLastPostedActivity(), getBounties()])
    .then(([lastPostedActivity, bounties]) => filterNew(lastPostedActivity)(bounties))
    .then(newBounties => {
      const newBountiesLength = newBounties.length;
      console.log('New bounties:', newBountiesLength);
      if (!newBountiesLength) {
        return;
      }

      return new Promise((resolve, reject) => {
        return resolve(newBounties.map(bounty => {
          if (!parseFloat(bounty.valueUsd)) {
            setLastPostedActivity(bounty);
            return bounty;
          }
          const message = bountyToMessage(bounty);
          return postTweet(message).then(tweet => {
            setLastPostedActivity(bounty);
            console.log('Tweet posted:', message);
            return tweet;
          }).catch(error => console.error('Problem posting tweet', message, error));
        }));
      })
      .catch(error => console.error('Problem posting tweets:', error));
    })
    .catch(error => console.error(error));

  Promise.all([getLastPostedActivity(), getActivity()])
    .then(([lastPostedActivity, activities]) => filterNew(lastPostedActivity)(activities))
    .then(newActivities => {
      const newActivitiesLength = newActivities.length;
      console.log('New activities:', newActivitiesLength);
      if (!newActivitiesLength) {
        return;
      }

      return new Promise((resolve, reject) => {
        return resolve(newActivities.map(activity => {
          const message = activityToMessage(activity);
          return postTweet(message).then(tweet => {
            console.log('Tweet posted:', message);
            setLastPostedActivity(activity);
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
  setInterval(fetchAndTweet, POLL_FREQUENCY);
});
