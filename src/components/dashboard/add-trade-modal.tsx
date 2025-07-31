
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
  "XAU/USD (Gold)", "USO/USD (Oil)", "BTC/USD", "ETH/USD", "SPX500", "NDX100", "TSLA", "AAPL", "AMZN"
];

const tradeSchema = z.object({
  asset: z.string().min(1, "Asset is required"),
  direction: z.enum(["Buy", "Sell"]),
  entryPrice: z.coerce.number().positive("Entry price must be positive"),
  lotSize: z.coerce.number().positive("Lot size must be positive"),
  stopLoss: z.coerce.number().optional(),
  takeProfit: z.coerce.number().optional(),
  result: z.enum(["Win", "Loss", "BE"]),
  pnl: z.coerce.number({invalid_type_error: "P/L is required"}),
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
      lotSize: undefined,
      stopLoss: undefined,
      takeProfit: undefined,
      result: "Win",
      date: new Date(),
      notes: "",
      screenshotUrl: "",
    },
  });

  useEffect(() => {
    if (open && isEditMode && tradeToEdit) {
        reset({
            ...tradeToEdit,
            date: tradeToEdit.date ? new Date(tradeToEdit.date) : new Date(),
            entryPrice: tradeToEdit.entryPrice || undefined,
            stopLoss: tradeToEdit.stopLoss || undefined,
            takeProfit: tradeToEdit.takeProfit || undefined,
            lotSize: tradeToEdit.lotSize || undefined,
        });
    } else if (open && !isEditMode) {
        reset({
          asset: "",
          direction: "Buy",
          entryPrice: undefined,
          lotSize: undefined,
          stopLoss: undefined,
          takeProfit: undefined,
          result: "Win",
          pnl: undefined,
          date: new Date(),
          notes: "",
          screenshotUrl: "",
        });
    }
  }, [tradeToEdit, isEditMode, reset, open]);


  const onSubmit = async (data: TradeFormValues) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to add a trade.", variant: "destructive" });
        return;
    }

    const tradeData = { 
        userId: user.uid, 
        ...data, 
        screenshotUrl: data.screenshotUrl || "",
        notes: data.notes || ""
    };

    try {
      if (isEditMode && tradeToEdit) {
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
  <Button size="sm" className="h-9 gap-1.5">
    <PlusCircle className="h-4 w-4" />
    <span>إضافة صفقة</span>
  </Button>
) : null;

return (
  <Dialog open={open} onOpenChange={setOpen}>
    {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle className="font-semibold">{isEditMode ? "تعديل الصفقة" : "تسجيل صفقة جديدة"}</DialogTitle>
        <DialogDescription>
          {isEditMode ? "حدّث تفاصيل الصفقة الخاصة بك." : "املأ تفاصيل صفقتك. اضغط حفظ عند الانتهاء."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5 grid-cols-2 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="asset" className="text-right">الأصل</Label>
            <Controller
              name="asset"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر الأصل" />
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
            <Label htmlFor="date" className="text-right">التاريخ</Label>
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
                      {field.value ? format(field.value, "PPP") : <span>اختر تاريخاً</span>}
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
            <Label htmlFor="direction" className="text-right">الاتجاه</Label>
            <Controller
              name="direction"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر الاتجاه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buy">شراء</SelectItem>
                    <SelectItem value="Sell">بيع</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lotSize" className="text-right">حجم اللوت</Label>
            <Controller
              name="lotSize"
              control={control}
              render={({ field }) => <Input id="lotSize" type="number" step="any" placeholder="0.01" className="col-span-3" {...field} value={field.value ?? ""} />}
            />
            {errors.lotSize && <p className="col-span-4 text-right text-sm text-destructive">{errors.lotSize.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entryPrice" className="text-right">سعر الدخول</Label>
            <Controller
              name="entryPrice"
              control={control}
              render={({ field }) => <Input id="entryPrice" type="number" step="any" placeholder="1.2500" className="col-span-3" {...field} value={field.value ?? ""} />}
            />
            {errors.entryPrice && <p className="col-span-4 text-right text-sm text-destructive">{errors.entryPrice.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stopLoss" className="text-right">وقف الخسارة</Label>
            <Controller
              name="stopLoss"
              control={control}
              render={({ field }) => <Input id="stopLoss" type="number" step="any" placeholder="1.2450" className="col-span-3" {...field} value={field.value ?? ""} />}
            />
            {errors.stopLoss && <p className="col-span-4 text-right text-sm text-destructive">{errors.stopLoss.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="takeProfit" className="text-right">جني الأرباح</Label>
            <Controller
              name="takeProfit"
              control={control}
              render={({ field }) => <Input id="takeProfit" type="number" step="any" placeholder="1.2600" className="col-span-3" {...field} value={field.value ?? ""} />}
            />
            {errors.takeProfit && <p className="col-span-4 text-right text-sm text-destructive">{errors.takeProfit.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="result" className="text-right">النتيجة</Label>
            <Controller
              name="result"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر النتيجة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Win">ربح</SelectItem>
                    <SelectItem value="Loss">خسارة</SelectItem>
                    <SelectItem value="BE">التعادل (BE)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pnl" className="text-right">الربح/الخسارة ($)</Label>
            <Controller
              name="pnl"
              control={control}
              render={({ field }) => <Input id="pnl" type="number" step="any" placeholder="250.50" className="col-span-3" {...field} value={field.value ?? ""} />}
            />
            {errors.pnl && <p className="col-span-4 text-right text-sm text-destructive">{errors.pnl.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="screenshotUrl" className="text-right pt-2">رابط صورة الشاشة</Label>
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
            <Label htmlFor="notes" className="text-right pt-2">ملاحظات</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="notes"
                  placeholder="اكتب أفكارك عن الصفقة، الاستراتيجية، المشاعر، إلخ."
                  className="col-span-3"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

}

    