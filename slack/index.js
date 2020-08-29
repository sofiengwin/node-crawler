const { WebClient } = require('@slack/web-api');
const dotenv = require('dotenv')

dotenv.config()

token = process.env.SLACK_TOKEN
console.log({token })
const web = new WebClient(token);

const postMessage = async (message) => {
  try { 
    const result = await web.chat.postMessage({
      text: 'Started Crawling: *BetEnsured*',
      channel: "C017P7H4BQC",
      blocks: message,
    });

    // The result contains an identifier for the message, `ts`.
    console.log(`Successfully send message ${result.ts}`);
  } catch (error) {
    console.log({error})
  }
}

const postSuccess = async (provider, tipsCount) => {
  const message = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `Completed Crawling: *${provider}* Successfully :100: Found *${tipsCount}* tips`
      }
    }
  ];

  await postMessage(message);
}

const postStartedCrawling = async (provider) => {
  const message = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `Started Crawling: *${provider}* :construction_worker:`
      }
    }
  ];

  await postMessage(message);
}

const postFailure = async (provider) => {
  const message = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `Failed To Crawl: *${provider}* :imp:`
      }
    }
  ];

  await postMessage(message);
}

module.exports = {
  postSuccess,
  postFailure,
  postStartedCrawling,
}