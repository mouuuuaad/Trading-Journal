
// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';

// This is a sensitive file and should not be exposed to the client.
// We check if the environment variable is set. If not, we cannot initialize the admin SDK.
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. The server cannot start.');
}

// The service account JSON is expected to be a base64 encoded string in the environment variable.
const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8')
);

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
