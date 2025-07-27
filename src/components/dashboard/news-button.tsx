
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Flame } from "lucide-react";
import { NewsTimeline } from "./news-timeline";

export function NewsButton() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg z-50">
                    <Flame className="h-7 w-7" />
                    <span className="sr-only">Open Market News</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[450px] p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="font-headline">Market News</SheetTitle>
                </SheetHeader>
                <div className="flex-1">
                    <NewsTimeline />
                </div>
            </SheetContent>
        </Sheet>
    )
}
