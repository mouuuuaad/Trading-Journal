
import { ShareClientPage } from './share-client-page';
import { Trade } from "@/lib/types";

type User = {
    displayName?: string;
    photoURL?: string;
}

type ShareData = {
    user: User;
    trades: Trade[];
    error?: string;
}

// This is now a React Server Component (RSC), which is the default in the App Router.
// It can fetch data directly on the server.
async function getShareData(userId: string): Promise<ShareData> {
    // We construct the full URL to fetch from our own API route.
    // Using process.env.NEXT_PUBLIC_VERCEL_URL for Vercel deployments,
    // or a fallback for local development.
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:9002';
    const url = `${baseUrl}/api/share/${userId}`;
    
    try {
        const res = await fetch(url, {
          // Use 'no-store' to ensure the data is fresh on every request.
          cache: 'no-store'
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { user: {displayName: 'Error'}, trades: [], error: errorData.error || `Failed to fetch data.` };
        }

        const data = await res.json();
        return { ...data, error: null };

    } catch (e: any) {
        console.error("Failed to fetch share data on server:", e);
        return { user: {displayName: 'Error'}, trades: [], error: "A network error occurred while fetching the share data." };
    }
}


export default async function SharePage({ params }: { params: { userId: string } }) {
  // Data is fetched on the server before the page is rendered.
  const { user, trades, error } = await getShareData(params.userId);

  // The fetched data is passed as simple props to the client component.
  // This avoids any client-side data fetching or param access issues.
  return <ShareClientPage initialUser={user} initialTrades={trades} error={error} />;
}
