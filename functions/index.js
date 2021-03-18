const functions = require("firebase-functions");
const admin = require("firebase-admin");


admin.initializeApp();

const db = admin.firestore();

// App reading Dashboard
exports.appReadDashboard = functions.https.onRequest((req, res) => {
  const staffEmail = req.query.email;

  const query = db.collection("staff")
      .where("email", "==", staffEmail)
      .limit(1);

  query.get().then((querySnapshot) => {
    querySnapshot.docs.map((doc) => {
      const patientList = doc.data().patients;
      res.status(200).send({
        "patientList": patientList,
      });
    });
  });
});

// App reading Info
exports.appReadInfo = functions.https.onRequest((req, res) => {
  const patientName = req.query.name;

  const query = db.collection("patients")
      .where("name", "==", patientName)
      .limit(1);

  query.get().then((querySnapshot) => {
    querySnapshot.docs.map((doc) => {
      const hr = doc.data().hr;
      const o2 = doc.data().oxygen;
      const temp = doc.data().temp;
      const loc = doc.data().location;

      res.status(200).send({
        "hr": hr,
        "o2": o2,
        "temp": temp,
        "lat": loc.latitude,
        "lon": loc.longitude,
      });
    });
  });
});


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
