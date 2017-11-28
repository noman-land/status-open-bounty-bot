const http = require('https');

const { makeJson } = require('./utils');

const { SELF_URL, SOB_ACTIVITY_URL, SOB_BOUNTIES_URL } = require('./constants');

function getActivity() {
  return new Promise((resolve, reject) => {
    http.get(SOB_ACTIVITY_URL, response => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('error', reject);
      response.on('end', () => resolve(makeJson(data)))
    })
  });
}

function getBounties() {
  return new Promise((resolve, reject) => {
    http.get(SOB_BOUNTIES_URL, response => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('error', reject);
      response.on('end', () => resolve(makeJson(data)));
    });
  });
}

function keepAlive() {
  http.get(SELF_URL, response => {
    response.on('error', e => console.log('Keep alive has errored', e));
    response.on('end', () => console.log('Still alive', new Date()));
  });
}

module.exports = {
  getActivity,
  getBounties,
  keepAlive,
};
