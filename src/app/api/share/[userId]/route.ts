import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from "firebase/firestore";
import { getFirebaseAdmin } from '@/lib/firebase-admin';

// This tells Next.js to run this route dynamically
export const dynamic = 'force-dynamic';


export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const { db, auth } = getFirebaseAdmin();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
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
    const tradesQuery = query(
      collection(db, "trades"),
      where("userId", "==", userId)
    );
    const tradesSnapshot = await getDocs(tradesQuery);

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
    console.error(`Error fetching share data for ${userId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `A server error occurred while fetching the share data: ${errorMessage}` }, { status: 500 });
  }
}
