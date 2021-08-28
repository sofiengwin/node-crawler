const { WebClient } = require('@slack/web-api');
const dotenv = require('dotenv')

dotenv.config()

token = process.env.SLACK_TOKEN
console.log({token })
const web = new WebClient(token);

const postMessage = async (blocks) => {
  try { 
    const result = await web.chat.postMessage({
      text: 'Started Crawling: *BetEnsured*',
      channel: "C017P7H4BQC",
      blocks: blocks,
    });

    // The result contains an identifier for the message, `ts`.
    console.log(`Successfully send message ${result.ts}`);
    return result;
  } catch (error) {
    console.log({error})
  }
}

const addStartedCrawling = (provider) => {
  return {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `Started Crawling: *${provider}* :construction_worker:`
    }
  }
}

const addFailure = (provider) => {
  return {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `Failed To Crawl: *${provider}* :imp:`
    }
  }
}

const addSuccessMessage = (provider, tips) => {
  const message = {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `Completed Crawling: *${provider}* Successfully :100: Found *${tips.length}* tips \n ${tips.map((tip, index) => `${index + 1}. *${tip.homeTeam} vs ${tip.awayTeam}*`).join("\n")}`
    }
  }

  return message;
}
const blocks = []
const providers = [
  'facebook',
  'youtube',
  'amazon',
  'netflix',
]

const tips = [
  {homeTeam: 'Man Utd', awayTeam: 'Chelsea'},
  {homeTeam: 'Man Utd', awayTeam: 'Chelsea'},
  {homeTeam: 'Man Utd', awayTeam: 'Chelsea'},
  {homeTeam: 'Man Utd', awayTeam: 'Chelsea'},
  {homeTeam: 'Man Utd', awayTeam: 'Chelsea'},
  {homeTeam: 'Man Utd', awayTeam: 'Chelsea'},
  {homeTeam: 'Man Utd', awayTeam: 'Chelsea'},
  {homeTeam: 'Man Utd', awayTeam: 'Chelsea'},
]

module.exports = {
  addFailure,
  addStartedCrawling,
  addSuccessMessage,
  postMessage
}