const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("C:/Users/harsh/Downloads/service-account.json"); // must store locally

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


// Band sending alert
exports.bandSendAlert = functions.https.onRequest((req, res) => {
  const body = req.body;

  const patient = body.patient;
  const msg = body.msg;

  sendAlert(patient, msg);
  
  res.status(200).send("testing");

});

// FCM communication 
async function sendAlert(patient, msg) {

 let notifTitle = `Alert: ${patient} is having an emergency!`
 let notifMsg =  `${msg}`

  const query = db.collection("secrets")
                  .doc("FCM-Registration-Token"); 


 const doc = await query.get(); 

 const registrationToken = doc.data().device;
 console.log(registrationToken)

  var message = {
    notification : {
     title: notifTitle,
     body : notifMsg
    }
  }; 

  admin.messaging().sendToDevice(registrationToken,message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });

}


