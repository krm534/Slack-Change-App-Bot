// Modules
const ngrok = require('ngrok');
const dotenv = require('dotenv').config();
const body_parser = require('body-parser');
const slack = require('./slack.js');
const express = require('express');
const app = express();

// Middleware 
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

// Variables
const PORT = 80;

// Application content
app.use('/slack',slack);

// Listen on port number
app.listen(process.env.PORT || PORT, () => {
    console.log(`Listening on port ${PORT}`);
});