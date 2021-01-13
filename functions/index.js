const functions = require('firebase-functions');

exports.dashboard = functions.https.onRequest((req, res) => {
  res.status(200).send("Dashboard");
});
