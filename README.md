# Slackbot Documentation
> Node.js app that acts as a Slack bot
### Steps
---
1. This project assumes you have prior Node.js/JavaScript experience. To learn more go [here](https://nodejs.org/en/docs/guides/).
2. Download the project onto your machine.
3. Navigate to project location via Node.js command line and run
```bash
	npm i 
``` 
to install all the node_modules for the dependencies.
4. Create a .env file to store an environment variable named OAUTH_BOT_TOKEN which will contain the bot's oauth token (sent in email). Click [here](https://www.npmjs.com/package/dotenv) to learn more about .env files.
5. Start a ngrok connection by running 
```bash
   ngrok http 80
```
in another Node.js command line terminal. So, there should be two terminals open. Learn more about ngrok [here](https://ngrok.com/docs).
6. Navigate to [here](https://api.slack.com/apps). Log in to the dev account and select coin-change-app. 
7. Choose **Slash Commands** from the options listed. There should be two slash commands (change and receipt).
8. Click edit on the __change__ slash command.
9. Change the Request URL input field to your ngrok forwarding https URL.The input field should like *ngrokURL/slack/change*.
10. Change the input field of the __receipt__ slash command to *ngrokURL/slack/receipt*.
11. Run the application in the Node.js command line terminal that is not running ngrok.
```bash
   node index.js
```
12. Run one of the Slack slash commands in the Slack channel called Coin-Change-Bot.
13. The bot should work at this point.
