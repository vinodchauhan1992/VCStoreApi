const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}`,
  projectId: `${process.env.FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.FIREBASE_APP_ID}`,
  measurementId: `${process.env.FIREBASE_MEASUREMENT_ID}`,
};

const firebaseDB = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
module.exports = getStorage(firebaseDB);