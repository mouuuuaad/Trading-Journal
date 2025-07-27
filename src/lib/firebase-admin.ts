
// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// This is a sensitive file and should not be exposed to the client.
// We use environment variables to store the service account credentials.
// The service account JSON should be base64 encoded and stored in an environment variable.
const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!, 'base64').toString('ascii')
);

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // Add your databaseURL here if you are using Realtime Database
        // databaseURL: 'https://<your-project-id>.firebaseio.com' 
    });
}

const db = admin.firestore();

export { db };
