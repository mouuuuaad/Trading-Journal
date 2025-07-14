
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";


const tradeSchema = z.object({
  asset: z.string().min(1, "Asset is required"),
  direction: z.enum(["Buy", "Sell"]),
  entryPrice: z.coerce.number().positive("Entry price must be positive"),
  stopLoss: z.coerce.number().positive("Stop loss must be positive"),
  takeProfit: z.coerce.number().positive("Take profit must be positive"),
  result: z.enum(["Win", "Loss", "BE"]),
  date: z.date(),
  notes: z.string().optional(),
});

type TradeFormValues = z.infer<typeof tradeSchema>;

export function AddTradeModal() {
  const [open, setOpen] = useState(false);
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<TradeFormValues>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      asset: "",
      direction: "Buy",
      entryPrice: undefined,
      stopLoss: undefined,
      takeProfit: undefined,
      result: "Win",
      date: new Date(),
      notes: "",
    },
  });

  const onSubmit = async (data: TradeFormValues) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to add a trade.", variant: "destructive" });
        return;
    }

    let pnl = 0;
    // A more realistic PnL calculation could involve contract size, etc.
    // For now, we'll use a simplified price difference model.
    const priceDiff = data.direction === 'Buy'
        ? data.takeProfit - data.entryPrice
        : data.entryPrice - data.takeProfit;

    if (data.result === 'Win') {
        pnl = Math.abs(priceDiff);
    } else if (data.result === 'Loss') {
        const risk = Math.abs(data.entryPrice - data.stopLoss);
        pnl = -risk;
    }

    try {
      await addDoc(collection(db, "trades"), {
        userId: user.uid,
        asset: data.asset,
        direction: data.direction,
        entryPrice: data.entryPrice,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        result: data.result,
        notes: data.notes,
        pnl,
        date: data.date, // Storing as a Firebase Timestamp for better querying
      });

      toast({
        title: "Trade Logged",
        description: `Successfully added trade for ${data.asset}.`,
      });
      reset();
      setOpen(false);
    } catch (error: any) {
        toast({
            title: "Error saving trade",
            description: error.message,
            variant: "destructive",
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Trade
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Log New Trade</DialogTitle>
          <DialogDescription>
            Fill in the details of your trade. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="asset" className="text-right">Asset</Label>
              <Controller
                name="asset"
                control={control}
                render={({ field }) => <Input id="asset" placeholder="e.g., EUR/USD" className="col-span-3" {...field} />}
              />
               {errors.asset && <p className="col-span-4 text-right text-sm text-destructive">{errors.asset.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("col-span-3 justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direction" className="text-right">Direction</Label>
               <Controller
                name="direction"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Buy">Buy</SelectItem>
                      <SelectItem value="Sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entryPrice" className="text-right">Entry Price</Label>
              <Controller
                name="entryPrice"
                control={control}
                render={({ field }) => <Input id="entryPrice" type="number" step="any" placeholder="1.2500" className="col-span-3" {...field} value={field.value ?? ""} />}
              />
              {errors.entryPrice && <p className="col-span-4 text-right text-sm text-destructive">{errors.entryPrice.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stopLoss" className="text-right">Stop Loss</Label>
              <Controller
                name="stopLoss"
                control={control}
                render={({ field }) => <Input id="stopLoss" type="number" step="any" placeholder="1.2450" className="col-span-3" {...field} value={field.value ?? ""} />}
              />
              {errors.stopLoss && <p className="col-span-4 text-right text-sm text-destructive">{errors.stopLoss.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="takeProfit" className="text-right">Take Profit</Label>
              <Controller
                name="takeProfit"
                control={control}
                render={({ field }) => <Input id="takeProfit" type="number" step="any" placeholder="1.2600" className="col-span-3" {...field} value={field.value ?? ""} />}
              />
               {errors.takeProfit && <p className="col-span-4 text-right text-sm text-destructive">{errors.takeProfit.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="result" className="text-right">Result</Label>
               <Controller
                name="result"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Win">Win</SelectItem>
                      <SelectItem value="Loss">Loss</SelectItem>
                      <SelectItem value="BE">Break Even (BE)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => <Textarea id="notes" placeholder="Trade rationale, execution notes, etc." className="col-span-3" {...field} value={field.value ?? ""} />}
              />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Trade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
