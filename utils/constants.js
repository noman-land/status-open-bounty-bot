
const SOB_API_URL = process.env.SOB_BASE_URL + '/api';

const itemTypeVerbs = {
  'claim-payout': 'claimed',
  'open-claim': 'submitted'
};

const POLL_FREQUENCY = 10 * 60 * 1000;

module.exports = {
  itemTypeVerbs,
  POLL_FREQUENCY,
  SOB_ACTIVITY_URL: SOB_API_URL + '/activity-feed',
  SOB_BOUNTIES_URL: SOB_API_URL + '/open-bounties',
};
