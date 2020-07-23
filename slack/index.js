const { WebClient } = require('@slack/web-api');

token = process.env.SLACK_TOKEN

const web = new WebClient(token);

(async () => {
 
  // Post a message to the channel, and await the result.
  // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
  try { 
    const result = await web.chat.postMessage({
      text: 'This works all I needed was the permission to write to public channels',
      channel: "C017P7H4BQC",
    });

    // The result contains an identifier for the message, `ts`.
    console.log(`Successfully send message ${result.ts} in conversation ${conversationId}`);
  } catch (error) {
    console.log({error}, error.data.response_metadata)
  }
 

})();