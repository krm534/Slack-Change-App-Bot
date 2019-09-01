const request = require('request');
const shortid = require('shortid');
const sqlite3 =  require('sqlite3').verbose();
const express = require("express");
const router = express.Router();

// Variables
const accessToken = process.env.OAUTH_BOT_TOKEN;
let db, reqData, user;

// HTTP Form Data 
let formData = {
    token: `${accessToken}`,
    channel: "DMW4PQ4G6",
};

let headers = {
    "Content-Type":"application/json"
};

// Change
router.post('/change',(req,res) => {
    reqData = (parseFloat(req.body.text)).toFixed(2);

    // Checks if input is number
    if (isNaN(reqData) && typeof reqData !== Number || reqData <= 0 || reqData === null) {
        callSlack("Not a number / number is <= zero / number is empty (Error)",res);
        return;
    }

    // Call change algorithm
    let change = makeChange(reqData);

    // Store change in database
    db = new sqlite3.Database('./db/change-app.db', err => {
        if (err) {
            return console.log(err.message);
        }
        console.log("Connected to database");
    });
    let receiptID = storeData(change,req.body.user_id,reqData);

    // Send change amount to Slack
    callSlack(`(Receipt# ${receiptID}) The minimal change for $${req.body.text} is ${change[0]} dollars, ${change[1]} quarters, ${change[2]} dimes, ${change[3]} nickels, and ${change[4]} pennies`,res);
});

// Receipt
router.post('/receipt',(req,res) => {
    user = req.body.user_id;
    reqData = req.body.text;

    if (reqData === null){
        callSlack("Invalid receipt id",res);
        return;
    }

    // Get data from database
    db = new sqlite3.Database('./db/change-app.db', err => {
        if (err) {
            return console.log(err.message);
        }
        console.log("Connected to database");
    });
    checkReceipt(reqData,res);
});

// Change algorithm function
function makeChange(reqData) {
    let denominations = [1.00,.25,.10,.05,.01];
    let dollar=0,quarter=0,dime=0,nickel=0,penny=0,i=0;
    while (i < 5) {
        if ((reqData / denominations[i]) >= 1.00) {
            switch(i) {
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
    return [dollar,quarter,dime,nickel,penny];
}

// Database storage function
function storeData(change,user_id,origValue) {
    let receiptID = shortid.generate();
    let params = [receiptID,user_id,origValue,...change];
    let sql = `INSERT INTO receipt(ReceiptID,UserID,OriginalValue,Dollar,Quarter,Dime,Nickel,Penny) VALUES(?,?,?,?,?,?,?,?)`;
    db.run(sql, params, (err) => {
        if (err) {
            db.close();
            return console.log(err.message);
        }
        console.log("Row had been added to database table");
    });
    db.close();
    return receiptID;
}

// Check receipt id function
function checkReceipt(reqData,res) {
    let sql = "SELECT ReceiptID,UserID,OriginalValue,Dollar,Quarter,Dime,Nickel,Penny FROM receipt WHERE ReceiptID = ?", ret;
    db.get(sql,[reqData], (err, row) => {
        if (err) {
            db.close();
            return console.log(err.message);
        }
        
        ret = validateUser(row);

        if (ret === true) {
            db.close();
            callSlack(`(Receipt# ${row.ReceiptID}) Change: $${row.OriginalValue}, ${row.Dollar} dollars, ${row.Quarter} quarters, ${row.Dime} dimes, ${row.Nickel} nickels, ${row.Penny} pennies`,res);
        }
        else {
            db.close();
            callSlack("You are not authorized to edit this receipt / receipt not found (Error)",res);
        }
    });
}

// Validate user receipt function
function validateUser(row) {
    if (row === null || row === undefined) {
        return false;
    }
    else if (row.UserID !== user) {
        return false;
    }
    else {
        return true;
    }
}

// Call Slack function
function callSlack(text,res) {
    formData.text = text;
    request.post({url:"https://slack.com/api/chat.postMessage",formData:formData,headers},function (err, response, body) {
        if(err) {
            return console.log("Upload Failed: " + err);
        }
    });
    res.send();
}

module.exports = router;