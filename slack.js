const request = require('request');
const shortid = require('shortid');
const express = require("express");
const router = express.Router();

// Variables
const accessToken = process.env.OAUTH_BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;
let reqData;

// HTTP Form Data 
let formData = {
    token: `${accessToken}`,
    channel: `${channelId}`,
};

let headers = {
    "Content-Type": "application/json"
};

// Change
router.post('/change', (req, res) => {
    reqData = (parseFloat(req.body.text)).toFixed(2);

    // Checks if input is number
    if (isNaN(reqData) && typeof reqData !== Number || reqData <= 0 || reqData === null) {
        callSlack("Not a number / number is <= zero / number is empty (Error)", res);
        return;
    }

    // Call change algorithm
    let change = makeChange(reqData);

    // Send change amount to Slack
    callSlack(`The minimal change for ${req.body.text} is ${change[0]} dollars, ${change[1]} quarters, ${change[2]} dimes, ${change[3]} nickels, and ${change[4]} pennies`);

    // Send response
    res.sendStatus(200);
});

// Change algorithm function
function makeChange(reqData) {
    let denominations = [1.00, .25, .10, .05, .01];
    let dollar = 0, quarter = 0, dime = 0, nickel = 0, penny = 0, i = 0;
    while (i < 5) {
        if ((reqData / denominations[i]) >= 1.00) {
            switch (i) {
                case 0:
                    dollar++;
                    reqData = (reqData - 1.00).toFixed(2);
                    console.log("Dollar: " + reqData);
                    break;
                case 1:
                    quarter++;
                    reqData = (reqData - 0.25).toFixed(2);
                    console.log("Quarter: " + reqData);
                    break;
                case 2:
                    dime++;
                    reqData = (reqData - 0.10).toFixed(2);
                    console.log("Dime: " + reqData);
                    break;
                case 3:
                    nickel++;
                    reqData = (reqData - 0.05).toFixed(2);
                    console.log("Nickel: " + reqData);
                    break;
                case 4:
                    penny++;
                    reqData = (reqData - 0.01).toFixed(2);
                    console.log("Penny: " + reqData);
                    break;
            }
        }
        else {
            i++;
        }
    }
    return [dollar, quarter, dime, nickel, penny];
}

// Call Slack function
function callSlack(text) {
    formData.text = text;
    request.post({ url: "https://slack.com/api/chat.postMessage", formData: formData, headers }, function (err, response, body) {
        if (err) {
            console.log("Upload Failed: " + err);
        }
    });
}

module.exports = router;