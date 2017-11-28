const http = require('https');
const { itemTypeVerbs, SOB_ACTIVITY_URL, SOB_BOUNTIES_URL } = require('./constants');

const activityToMessage = activity => {
  const { displayName, issueTitle, itemType, valueUsd } = activity;
  let openingPart;

  if (itemType === 'open-claim') {
    openingPart = ` submitted a $${valueUsd} claim`;
  } else if (itemType === 'claim-payout') {
    openingPart = ` received $${valueUsd}`;
  } else if (itemType === 'claim-pending') {
    openingPart = `'s $${valueUsd} claim was accepted`
  }

  return `${displayName}${openingPart} for: ${issueTitle} ${makeIssueUrl(activity)}`;
};

const bountyToMessage = bounty => {
  const { issueTitle, repoOwner, valueUsd } = bounty;
  return `${repoOwner} posted a bounty worth $${valueUsd} ${makeIssueUrl(bounty)}`;
};

function convertKey(key) {
  return key.split('-')
    .map(function(keyPart, i) {
      return !i
        ? keyPart
        : keyPart[0].toUpperCase() + keyPart.slice(1);
    })
    .join('');
}

function convertToCamelKeys(object) {
  return Object.keys(object).reduce((accum, key) => ({ ...accum, [convertKey(key)]: object[key] }), {})
}

const makeIssueUrl = ({ issueNumber, repoName, repoOwner }) => {
  return `https://github.com/${repoOwner}/${repoName}/issues/${issueNumber}`;
};

function makeJson(data) {
  return JSON.parse(data)
    .map(convertToCamelKeys)
    .sort((itemA, itemB) => new Date(itemA.updated) - new Date(itemB.updated));
}

module.exports = {
  activityToMessage,
  bountyToMessage,
  convertToCamelKeys,
  makeJson,
};
