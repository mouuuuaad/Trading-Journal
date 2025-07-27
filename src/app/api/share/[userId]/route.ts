
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

const serviceAccount = {
  "type": "service_account",
  "project_id": "compass-6b774",
  "private_key_id": "b43bd14130e1b036aeeb4a6c2b3d01b93c16c030",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDEipcA84HB01an\n6LmZsYMJ2el5cEvgbIQH4I6T0BzLcB239XWSz1Bx4h2DghlM/mXZ3r0w4oWH0Qjc\nBdxtjJaNdK5mCjwMQuDLuL1HQTV64zmeg9klkuArBZ2/YEbGcYrVmaMGet3WAPpI\nC5/XvMPZseS/3MhEHggMQZzot2xhE5/1Deyy74OQ/yrk1gCPVkoahsdFsgJHVK5w\n+d9vDSmT/cI/SuVPyftfcV3w9gvTglzyeQv2caTOM2BqsjfxDorV22vw5K2Qjmbd\nRgvujIGIG0euwPVRI+b8mHvVfU2r+6kg+Fd6razsOPGv+XOeu5YXPrIBXplxQG0b\nJNcagpIpAgMBAAECggEAA/leF/Wp3tlJoXKKEjVYgMyoX71pY1vTsvRo8vcx0Iaa\nAJFqM7I/yQBj+A1GOrF9g2bGwjl1BBaHdyoigg/mLsJjEQrNml0zKMYPBGT+p6yh\ninbVtLX1ahlJI8isFbDPuFr3b2xGQQtbBDWWoVOeotpp1YapgVXEHuSoFL06Ep+8\nYs8/tkrDYkjG+5sjmjDNQkVtiq15UeZKL7akBRqoZOVNGRX0saVfF40n35r+dvbG\nPyZcglj+fBoMf8c6hpqwNZINJMAakT39Zj2CBcEEwVryb0fcsZJ4q8qBTREIJAK2\nCT97/QY6Wz1d+PXZqulzezHEl6r662oFat+n8W/HiwKBgQDoMlV1aer/sa45IftL\nsSfgoGwZkLb/2aOCN2/w8zdLGY+DR/GKezy+63Enyhx2bjsLNm4Qj4D6HJYXuRF0\nqCDWz9DvmuccVhPqHDPv159mp+774Em1nFbsB6+d0y2/9Myt96Fj9BGw8hBtOCow\n4/2o/znuGucBgQ9SBheyuLIrGwKBgQDYsIkJCLl+a/yh94FiJ2qQ78f3xbhUXNTt\nYAxAw8MItezxdQla6D5nUpCAcdSk04IBnD5OTT8AtMug4hrsuQewsIHMpE+LXbku\nHcjPcRpGn7UUB3ZBdSWrN8gKXOnubYNDrXDbR5b8DD378/bOailbTxeTz14kDHjw\nJscdy8OoCwKBgG41Rb6e8T0/llPjvySkBytkuSpBN7qkECmEKouQxRPOJAHJqely\nqNhtY53hHjVQCJI/2Wne0vbjjpHf81sNWdjbdm3jdgJLENSzYitainvtBU9jm1ip\nxc/trfsY+sP7axK/UEji1WrI2ecdG1ltPT5zNYnAFxjtqtnhrmnTpC01AoGACuhg\nDY9d3wpKjlCqN6mqSJ95XnSagcymf0h9dWklUTPvOHxeuy/DrGnQklaokJ+BBNm7\nnS9wQ3XWZkPbfR0XUQKhlg6TXn2aS8L+D8suum1hrR9vCX5/Je5J6JOixvjGScra\nSn+BDzECkcNHIj7f1BPYKP2gTIpAMD6TeWF/eN8CgYEA5dsZXDcG9osO/kqantAA\n332SwGaac7Fz7DLwFEmLBucAw6/0ldep6lO6Ualctqu7As4S6AT/P24ENeXubmSH\n7bh02GZdMouDeNI6e5CVkZCjURQi59Qkl+XoIef3P2S7sfav5TU+YxuCdpo8CNKu\n7cRdwoCESVeA/nGyg6iQPbw=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-fbsvc@compass-6b774.iam.gserviceaccount.com",
  "client_id": "117447338856626398321",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40compass-6b774.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

function getFirebaseAdmin() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    const auth = admin.auth();
    const db = getFirestore();
    return { auth, db };
}


export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const token = params.userId; // The token is now the dynamic part of the URL

  if (!token) {
    return NextResponse.json({ error: 'Share token is missing' }, { status: 400 });
  }
  
  try {
    const { auth, db } = getFirebaseAdmin();

    const tokenQuery = db.collection("shareTokens").where("token", "==", token);
    const tokenSnapshot = await tokenQuery.get();

    if (tokenSnapshot.empty) {
         return NextResponse.json({ error: 'This link is invalid or has already been used.' }, { status: 404 });
    }

    const tokenDoc = tokenSnapshot.docs[0];
    const tokenData = tokenDoc.data();
    
    // Check for expiration
    const now = Timestamp.now();
    if (tokenData.expiresAt.toMillis() < now.toMillis()) {
        // Optionally delete the expired token
        await tokenDoc.ref.delete();
        return NextResponse.json({ error: 'This link has expired.' }, { status: 410 }); // 410 Gone
    }

    const userId = tokenData.userId;

    // 1. Fetch User Data
    let userData = { displayName: "Anonymous User", photoURL: "" };
    try {
        const userRecord = await auth.getUser(userId);
        userData = {
            displayName: userRecord.displayName || "Anonymous User",
            photoURL: userRecord.photoURL || ""
        };
    } catch (error) {
        console.warn(`Could not fetch user data for ${userId}:`, error);
    }

    // 2. Fetch Trades
    const tradesQuery = db.collection("trades").where("userId", "==", userId);
    const tradesSnapshot = await tradesQuery.get();


    const trades = tradesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate().toISOString() : new Date().toISOString(),
      };
    });
    
    return NextResponse.json({ user: userData, trades });

  } catch (error) {
    console.error(`Error fetching share data for token ${token}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `A server error occurred while fetching the share data: ${errorMessage}` }, { status: 500 });
  }
}

    