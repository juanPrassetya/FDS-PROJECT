const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/proxy', async (req, res) => {
  try {
    const response = await axios.get('http://101.255.117.74:8383/login'); // Make the insecure HTTP request
    res.json(response.data); // Return the response to the Angular app
  } catch (error) {
    res.status(500).send('Error occurred'); // Handle any errors that occur
  }
});

exports.proxy = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
