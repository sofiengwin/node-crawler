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

const manageOutcomeMessage = `
{
	"type": "block_actions",
	"user": {
		"id": "U0CA5",
		"username": "Amy McGee",
		"name": "Amy McGee",
		"team_id": "T3MDE"
	},
	"api_app_id": "A0CA5",
	"token": "Shh_its_a_seekrit",
	"container": {
		"type": "message",
		"text": "The contents of the original message where the action originated"
	},
	"trigger_id": "12466734323.1395872398",
	"team": {
		"id": "T0CAG",
		"domain": "acme-creamery"
	},
	"response_url": "https://www.postresponsestome.com/T123567/1509734234",
	"actions": [
		{
			"type": "static_select",
			"block_id": "3or",
			"action_id": "GghGF",
			"selected_option": {
				"text": {
					"type": "plain_text",
					"text": "Cancelled",
					"emoji": true
				},
				"value": "cancelled-2872828282828829292929"
			},
			"placeholder": {
				"type": "plain_text",
				"text": "Manage Outcome",
				"emoji": true
			},
			"action_ts": "1599052398.095316"
		}
	]
}
`