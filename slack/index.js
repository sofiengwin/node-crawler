const { WebClient } = require('@slack/web-api');
const dotenv = require('dotenv')

dotenv.config()

token = process.env.SLACK_TOKEN
console.log({token })
const web = new WebClient(token);

const postMessage = async (message, parentId) => {
  try { 
    const result = await web.chat.postMessage({
      text: 'Started Crawling: *BetEnsured*',
      channel: "C017P7H4BQC",
      blocks: message,
      thread_ts: parentId,
    });

    // The result contains an identifier for the message, `ts`.
    console.log(`Successfully send message ${result.ts}`);
    return result;
  } catch (error) {
    console.log({error})
  }
}

const postSuccess = async (provider, tips) => {
  const message = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `Completed Crawling: *${provider}* Successfully :100: Found *${tips.length}* tips`
      }
    }
  ];

  const response = await postMessage(message);
  for(const tip of tips) {
    await postReply(tip, response.ts)
  }
}

const postReply = async (tip, parentId) => {
  const message = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `${tip.homeTeam} vs ${tip.awayTeam}`,
      }
    }
  ];

  await postMessage(message, parentId);
}
const postSingle = async (messages) => {
  const message = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `${messages.join('\n')}`,
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

const addSuccessMessage = (provider, tips) => `Completed Crawling: *${provider}* Successfully :100: Found *${tips.length}* tips`;
const addStartedCrawlingMessage = (provider) => `Started Crawling: *${provider}* :construction_worker:`
const addFailureMessage = (provider) => `Started Crawling: *${provider}* :construction_worker:`

module.exports = {
  postSuccess,
  postFailure,
  postStartedCrawling,
  addSuccessMessage,
  addStartedCrawlingMessage,
  addFailureMessage,
  postSingle,
}