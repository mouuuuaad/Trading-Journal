
// src/app/api/share/[userId]/route.ts
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase-admin"; // Using admin SDK for server-side access
import { getAuth } from "firebase-admin/auth";
import { NextResponse } from "next/server";

// This tells Next.js to treat this route as dynamic,
// which is necessary for it to work correctly in production after deployment.
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 1. Fetch User Data using the Admin SDK
    let userData = { displayName: "Anonymous User", photoURL: "" };
    try {
        const userRecord = await getAuth().getUser(userId);
        userData = {
            displayName: userRecord.displayName || "Anonymous User",
            photoURL: userRecord.photoURL || ""
        };
    } catch (error: any) {
        // If the user doesn't exist in Firebase Auth, we can still proceed
        // but log the error. The profile will just show "Anonymous User".
        console.warn(`Could not fetch user data for a share link: ${error.message}`);
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
            // Ensure date is in a serializable format (ISO string)
            date: data.date.toDate().toISOString(),
        };
    });

    // Sort trades by date, most recent first
    trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    return NextResponse.json({ user: userData, trades });

  } catch (error: any) {
    console.error("API Error fetching share data:", error);
    return NextResponse.json({ error: "Failed to fetch trade data", details: error.message }, { status: 500 });
  }
}
