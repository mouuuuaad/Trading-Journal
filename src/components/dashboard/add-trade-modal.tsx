
"use client"

import { useEffect, useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Textarea } from "../ui/textarea";
import { Trade } from "@/lib/types";

const popularAssets = [
  "EUR/USD", "GBP/USD", "USD/JPY", "USD/CAD", "AUD/USD",
  "XAU/USD (Gold)", "USO/USD (Oil)", "BTC/USD", "ETH/USD", "SPX500"
];

const tradeSchema = z.object({
  asset: z.string().min(1, "Asset is required"),
  direction: z.enum(["Buy", "Sell"]),
  entryPrice: z.coerce.number().positive("Entry price must be positive"),
  stopLoss: z.coerce.number().positive("Stop loss must be positive"),
  takeProfit: z.coerce.number().positive("Take profit must be positive"),
  result: z.enum(["Win", "Loss", "BE"]),
  date: z.date(),
  notes: z.string().optional(),
  screenshotUrl: z.string().url().optional().or(z.literal('')),
});

type TradeFormValues = z.infer<typeof tradeSchema>;

interface AddTradeModalProps {
  tradeToEdit?: Trade | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddTradeModal({ tradeToEdit, isOpen, onOpenChange }: AddTradeModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [user] = useAuthState(auth);
  const { toast } = useToast();

  const isControlled = isOpen !== undefined && onOpenChange !== undefined;
  const open = isControlled ? isOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;
  
  const isEditMode = !!tradeToEdit;

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
      screenshotUrl: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
        reset({
            ...tradeToEdit,
            entryPrice: tradeToEdit.entryPrice || undefined,
            stopLoss: tradeToEdit.stopLoss || undefined,
            takeProfit: tradeToEdit.takeProfit || undefined,
        });
    } else {
        reset(); // Reset to default values for add mode
    }
  }, [tradeToEdit, isEditMode, reset, open]);


  const calculatePnl = (data: TradeFormValues) => {
    let pnl = 0;
    const risk = Math.abs(data.entryPrice - data.stopLoss);
    
    if (data.result === 'Win') {
        const reward = Math.abs(data.takeProfit - data.entryPrice);
        pnl = reward;
    } else if (data.result === 'Loss') {
        pnl = -risk;
    }
    return pnl;
  }

  const onSubmit = async (data: TradeFormValues) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to add a trade.", variant: "destructive" });
        return;
    }

    const pnl = calculatePnl(data);
    const tradeData = { userId: user.uid, ...data, pnl };

    try {
      if (isEditMode) {
        const tradeRef = doc(db, "trades", tradeToEdit.id);
        await updateDoc(tradeRef, tradeData);
        toast({ title: "Trade Updated", description: `Successfully updated trade for ${data.asset}.` });
      } else {
        await addDoc(collection(db, "trades"), tradeData);
        toast({ title: "Trade Logged", description: `Successfully added trade for ${data.asset}.` });
      }
      
      reset();
      setOpen(false);
    } catch (error: any) {
        toast({
            title: isEditMode ? "Error updating trade" : "Error saving trade",
            description: error.message,
            variant: "destructive",
        });
    }
  };

  const trigger = !isEditMode ? (
     <Button size="sm" className="h-9 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Trade
          </span>
        </Button>
  ) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditMode ? "Edit Trade" : "Log New Trade"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details of your trade." : "Fill in the details of your trade. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="asset" className="text-right">Asset</Label>
               <Controller
                name="asset"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select an asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularAssets.map(asset => (
                        <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                <Label htmlFor="screenshotUrl" className="text-right pt-2">Screenshot URL</Label>
                <Controller
                    name="screenshotUrl"
                    control={control}
                    render={({ field }) => (
                    <Input
                        id="screenshotUrl"
                        placeholder="https://example.com/image.png"
                        className="col-span-3"
                        {...field}
                         value={field.value ?? ""}
                    />
                    )}
                />
                {errors.screenshotUrl && <p className="col-span-4 text-right text-sm text-destructive">{errors.screenshotUrl.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="notes"
                    placeholder="Enter your thoughts on the trade, strategy, emotions, etc."
                    className="col-span-3"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
