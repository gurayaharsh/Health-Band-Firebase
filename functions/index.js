const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Store locally
// const serviceAccount =
// require("C:/Users/harsh/Downloads/service-account.json");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

// Band writing info
exports.bandWriteInfo = functions.https.onRequest((req, res) => {
  const body = req.body;

  const name = body.name;
  const hr = body.hr;
  const o2 = body.o2;
  const temp = body.temp;
  const loc = new admin.firestore.GeoPoint(body.lat, body.lon);

  const doc = {
    name: name,
    hr: hr,
    oxygen: o2,
    temp: temp,
    loc: loc,
    created: admin.firestore.FieldValue.serverTimestamp(),
  };

  db.collection("patients").add(doc);

  res.status(200).send("sucessfully added doc!");
});

// Band sending alert
exports.bandSendAlert = functions.https.onRequest((req, res) => {
  const body = req.body;

  const patient = body.patient;
  const msg = body.msg;

  // FCM communication

  const notifTitle = `Alert: ${patient} is having an emergency!`;
  const notifMsg = `${msg}`;

  db.collection("secrets")
      .doc("FCM-Registration-Token")
      .get()
      .then((doc) => doc.data().device)
      .then((registrationToken) => {
        const message = {
          notification: {
            title: notifTitle,
            body: notifMsg,
          },
        };

        admin.messaging().sendToDevice(registrationToken, message)
            .then((response) => {
              // Response is a message ID string.
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });
      });

  res.status(200).send("testing");
});


