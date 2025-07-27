
import { ShareClientPage } from './share-client-page';
import { Trade } from "@/lib/types";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase-admin"; // Using admin SDK for server-side access
import { getAuth } from "firebase-admin/auth";

type User = {
    displayName?: string;
    photoURL?: string;
}

type ShareData = {
    user: User;
    trades: Trade[];
    error?: string;
}

// This is a React Server Component (RSC), which is the default in the App Router.
// It can fetch data directly on the server.
async function getShareData(userId: string): Promise<ShareData> {
    try {
        // 1. Fetch User Data using the Admin SDK
        let userData: User = { displayName: "Anonymous User", photoURL: "" };
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
            } as Trade;
        });
        
        // Sort trades by date, most recent first
        trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


        return { user: userData, trades, error: undefined };

    } catch (e: any) {
        console.error("Failed to fetch share data on server:", e);
        return { user: {displayName: 'Error'}, trades: [], error: "A server error occurred while fetching the share data." };
    }
}


export default async function SharePage({ params }: { params: { userId:string } }) {
  // Data is fetched on the server before the page is rendered.
  const { user, trades, error } = await getShareData(params.userId);

  // The fetched data is passed as simple props to the client component.
  // This avoids any client-side data fetching or param access issues.
  return <ShareClientPage initialUser={user} initialTrades={trades} error={error} />;
}
