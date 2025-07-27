
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Trade } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpenCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Metadata } from "next";

// This component now sets its own metadata
// export const metadata: Metadata = {
//   title: "Trade Review - TradeVision",
//   description: "Review your past trades one-by-one to learn and improve.",
// };


const DetailRow = ({ label, value, valueClassName }: { label: string; value: React.ReactNode; valueClassName?: string }) => (
    <div className="flex flex-col sm:flex-row justify-between border-b py-2 text-sm sm:items-center">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className={cn("font-semibold text-right text-base", valueClassName)}>{value}</span>
    </div>
);

export default function ReviewPage() {
    const [user, loadingUser] = useAuthState(auth);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [postAnalysis, setPostAnalysis] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const tradesQuery = useMemo(() => {
        if (user) {
            return query(collection(db, "trades"), where("userId", "==", user.uid));
        }
        return null;
    }, [user]);

    const [tradesSnapshot, loadingTrades] = useCollection(tradesQuery);

    useEffect(() => {
        if (tradesSnapshot) {
            const tradesData = tradesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
                } as Trade;
            });
            tradesData.sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort oldest to newest
            setTrades(tradesData);
        } else {
            setTrades([]);
        }
    }, [tradesSnapshot]);

    const currentTrade = trades.length > 0 ? trades[currentIndex] : null;

    useEffect(() => {
        if (currentTrade) {
            setPostAnalysis(currentTrade.postAnalysis || "");
        }
    }, [currentTrade]);

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, trades.length - 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleSaveAnalysis = async () => {
        if (!currentTrade) return;
        setIsSaving(true);
        try {
            const tradeRef = doc(db, "trades", currentTrade.id);
            await updateDoc(tradeRef, { postAnalysis: postAnalysis });
            
            // Update local state to avoid re-fetching
            const updatedTrades = [...trades];
            updatedTrades[currentIndex].postAnalysis = postAnalysis;
            setTrades(updatedTrades);

            toast({
                title: "Analysis Saved",
                description: "Your post-trade analysis has been successfully saved.",
            });
        } catch (error: any) {
            toast({
                title: "Error Saving",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const isLoading = loadingUser || loadingTrades;

    return (
        <>
            <main className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
                <div className="space-y-2">
                    <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">Trade Review</h1>
                    <p className="text-muted-foreground">Go through your trades one-by-one to analyze and learn from them.</p>
                </div>

                {isLoading ? (
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                        </CardFooter>
                    </Card>
                ) : trades.length === 0 ? (
                    <Card className="max-w-4xl mx-auto flex flex-col items-center justify-center h-96">
                        <CardHeader className="text-center">
                            <BookOpenCheck className="mx-auto h-16 w-16 text-muted-foreground" />
                            <CardTitle className="mt-4">No Trades to Review</CardTitle>
                            <CardDescription>
                                Add some trades in your dashboard to start your review session.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : currentTrade && (
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="font-headline text-2xl">{currentTrade.asset}</CardTitle>
                                    <CardDescription>{format(currentTrade.date, "eeee, MMMM d, yyyy 'at' p")}</CardDescription>
                                </div>
                                <div className="text-right">
                                    <Badge variant={currentTrade.result === "Win" ? "default" : currentTrade.result === "Loss" ? "destructive" : "secondary"} className={cn("w-[60px] justify-center text-base", currentTrade.result === 'Win' ? 'bg-accent text-accent-foreground hover:bg-accent/80' : '')}>
                                        {currentTrade.result}
                                    </Badge>
                                    <p className={cn("font-bold text-lg", currentTrade.pnl >= 0 ? "text-accent" : "text-destructive")}>
                                        {currentTrade.pnl >= 0 ? "+" : ""}${currentTrade.pnl.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {currentTrade.screenshotUrl && (
                                <div className="space-y-2 pt-2">
                                    <div className="p-2 border rounded-md bg-muted/20">
                                        <img src={currentTrade.screenshotUrl} alt={`Screenshot for ${currentTrade.asset} trade`} className="w-full h-auto rounded-md object-contain max-h-[400px]" />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                <DetailRow label="Direction" value={currentTrade.direction} valueClassName={currentTrade.direction === "Buy" ? "text-green-500" : "text-red-500"} />
                                <DetailRow label="Entry Price" value={currentTrade.entryPrice.toFixed(4)} />
                                <DetailRow label="Stop Loss" value={currentTrade.stopLoss.toFixed(4)} />
                                <DetailRow label="Take Profit" value={currentTrade.takeProfit.toFixed(4)} />
                            </div>

                            {currentTrade.notes && (
                                <div className="space-y-2 pt-2">
                                    <h4 className="font-medium text-foreground">Original Notes</h4>
                                    <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground whitespace-pre-wrap border">
                                        {currentTrade.notes}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="post-analysis" className="text-base font-medium text-foreground">Post-Trade Analysis</Label>
                                <p className="text-sm text-muted-foreground">What did you do well? What could you improve? What did you learn?</p>
                                <Textarea
                                    id="post-analysis"
                                    value={postAnalysis}
                                    onChange={(e) => setPostAnalysis(e.target.value)}
                                    placeholder="I followed my plan perfectly..."
                                    rows={5}
                                    className="text-base"
                                />
                                <div className="flex justify-end pt-2">
                                    <Button onClick={handleSaveAnalysis} disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save Analysis"}
                                    </Button>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-between items-center border-t pt-6">
                            <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>
                             <p className="text-sm text-muted-foreground">
                                Trade {currentIndex + 1} of {trades.length}
                            </p>
                            <Button variant="outline" onClick={handleNext} disabled={currentIndex === trades.length - 1}>
                                Next <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </main>
        </>
    );
}
