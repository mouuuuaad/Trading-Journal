
// src/app/api/share/[userId]/route.ts
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase-admin"; // Using admin SDK
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

    // 1. Fetch User Data (like displayName)
    const userDocRef = doc(db, `users/${userId}`);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.exists() ? userDocSnap.data() : { displayName: "Anonymous User", email: "" };


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
