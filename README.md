## Status Open Bounty Bot

Posting to Twitter when bounties on Status Open Bounty are added, updated, or claimed.

### Development

1. Clone repo and enter project folder:
    ```
    git clone https://github.com/noman-land/status-open-bounty-bot.git && cd status-open-bounty-bot;
    ```
2. Install dependencies
    ```
    npm install;
    ```
3. Add environment variables file:
    ```
    touch .env;
    ```
4. Add the following 5 variables. You will need to get your own API keys from Twitter:
    ```
    CONSUMER_KEY=xxxxxxxxxx
    CONSUMER_SECRET=xxxxxxxxxx
    ACCESS_TOKEN_KEY=xxxxxxxxxx
    ACCESS_TOKEN_SECRET=xxxxxxxxxx
    SOB_BASE_URL=https://openbounty.status.im:444
    REDIS_URI=user:pass@databaseurl.com:45149
    ```
5. Fire up the app with:
    ```
    heroku local;
    ```
**Note**:

Pushes to the `master` branch get auto-deployed to the production app located at https://status-open-bounty-bot.herokuapp.com and will post tweets to [@OpenBountyBot](https://twitter.com/OpenBountyBot)

Pushes to the `develop` branch get auto-deployed to the staging app located at https://status-open-bounty-bot-qa.herokuapp.com and will post tweets to [@TestBoyBot](https://twitter.com/TestBoyBot)
