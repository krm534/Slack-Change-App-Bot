# Slackbot Documentation
> Node.js app that acts as a Slack bot for generating the fewest amount of change for a dollar input value

### Steps
---
1. Ngrok was used to test since Slack needs to access a public service to issue Slack commands to.
2. If using Ngrok, see the Ngrok Setup section
3. Navigate to Slack API [here](https://api.slack.com/apps). Log into the workspace you are using and create a new application.
4. Choose **Slash Commands** from the options listed under your new application. Create a new command called change.
5. Click edit on the new slash command.
6. Change the Request URL input field to generated Ngrok forwarding https URL if using Ngrok.The input field should be similar to ```<ngrok_url>/slack/change```.
7. If not using Ngrok, set the Request URL to whatever address your application is hosted at in the public domain.
8. Configure the application environment variables to the correct OAUTH_BOT_TOKEN and CHANNEL_ID for your new Slack application.
9. Finally, run the application: ```node index.js```.
10. Test by issuing the command ```/change .50``` in the correct Slack channel that corresponds to the application. The bot should respond with 2 quarters being the fewest amount of change.

### Ngrok Setup
1. Start a ngrok connection by running: ```ngrok http 1300```.
You need an Ngrok account to use it but it is free.
Learn more about ngrok [here](https://ngrok.com/docs).
2. Ngrok is basically used to give users public domain URLs that tunnel to user local machines for testing with services like Slack APIs.
