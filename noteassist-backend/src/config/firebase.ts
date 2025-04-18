import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
});

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage(); 