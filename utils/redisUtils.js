const redis = require('redis');

const { REDIS_URI } = process.env;

const client = redis.createClient({ url: REDIS_URI });

function getLastPostedActivity() {
  return new Promise((resolve, reject) => {
    client.get('lastPostedActivity', (error, result) => {
      if (error) reject(error);
      let bounty = JSON.parse(result);

      if (!bounty) {
        bounty = { updated: new Date().toISOString() };
        setLastPostedActivity(bounty);
      }

      resolve(bounty);
    });
  });
}

function setLastPostedActivity(activity) {
  return new Promise((resolve, reject) => {
    client.set('lastPostedActivity', JSON.stringify(activity), (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}

module.exports = {
  getLastPostedActivity,
  setLastPostedActivity,
};
