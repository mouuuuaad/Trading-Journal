
"use client";

import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProfile } from "firebase/auth";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Loader2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const { setTheme, theme } = useTheme();
  const [shareableLink, setShareableLink] = React.useState("");
  const [isGeneratingLink, setIsGeneratingLink] = React.useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.displayName || "",
    },
  });

  React.useEffect(() => {
    if (user?.displayName) {
      reset({ name: user.displayName });
    }
  }, [user, reset]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (user) {
      try {
        await updateProfile(user, { displayName: data.name });
        toast({
          title: "Profile Updated",
          description: "Your name has been successfully updated.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleGenerateLink = async () => {
    if (!user) {
       toast({
          title: "Not Logged In",
          description: "You must be logged in to generate a link.",
          variant: "destructive",
        });
        return;
    }

    setIsGeneratingLink(true);
    try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/share/generate', { 
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to generate link");
        }
        
        const link = `${window.location.origin}/share/${data.token}`;
        setShareableLink(link);

    } catch (error: any) {
         toast({
          title: "Error Generating Link",
          description: error.message,
          variant: "destructive",
        });
    } finally {
        setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = () => {
    if (!shareableLink) return;
    navigator.clipboard.writeText(shareableLink).then(() => {
        toast({ title: "Copied to Clipboard", description: "Your shareable link has been copied." });
    }, (err) => {
        toast({ title: "Failed to Copy", description: "Could not copy the link.", variant: "destructive"});
    });
  };

  const handleDeleteAllTrades = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete trades.",
        variant: "destructive",
      });
      return;
    }

    try {
      const tradesQuery = query(
        collection(db, "trades"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(tradesQuery);
      if (querySnapshot.empty) {
        toast({
          title: "No Trades Found",
          description: "There are no trades to delete.",
        });
        return;
      }

      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      toast({
        title: "All Trades Deleted",
        description: "Your trading history has been cleared.",
      });
    } catch (error: any) {
      toast({
        title: "Error Deleting Trades",
        description: error.message,
        variant: "destructive",
      });
    }
  };


  return (
    <main className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
      <div className="space-y-2">
        <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-muted-foreground">Manage your account, appearance, and data.</p>
      </div>
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onProfileSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} disabled={isSubmitting}/>
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} disabled />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue={theme}
                onValueChange={setTheme}
                className="grid max-w-md grid-cols-1 gap-8 pt-2 sm:grid-cols-3"
              >
                <div>
                  <RadioGroupItem value="light" id="light" className="peer sr-only" />
                  <Label
                    htmlFor="light"
                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                     <div className="w-full bg-gray-100 p-2 rounded-lg aspect-video flex items-center">
                        <div className="space-y-2 rounded-sm bg-white p-2 shadow-sm w-full">
                            <div className="h-2 w-4/5 rounded-lg bg-gray-300" />
                            <div className="h-2 w-full rounded-lg bg-gray-300" />
                        </div>
                     </div>
                     <span className="block w-full p-2 text-center font-normal">Light</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                  <Label
                    htmlFor="dark"
                     className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="w-full bg-gray-900 p-2 rounded-lg aspect-video flex items-center">
                        <div className="space-y-2 rounded-sm bg-gray-800 p-2 shadow-sm w-full">
                            <div className="h-2 w-4/5 rounded-lg bg-gray-400" />
                            <div className="h-2 w-full rounded-lg bg-gray-400" />
                        </div>
                     </div>
                     <span className="block w-full p-2 text-center font-normal">Dark</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="system" id="system" className="peer sr-only" />
                  <Label
                    htmlFor="system"
                     className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="w-full bg-gray-100 dark:bg-gray-900 p-2 rounded-lg aspect-video flex items-center">
                        <div className="space-y-2 rounded-sm bg-white dark:bg-gray-800 p-2 shadow-sm w-full">
                            <div className="h-2 w-4/5 rounded-lg bg-gray-300 dark:bg-gray-400" />
                            <div className="h-2 w-full rounded-lg bg-gray-300 dark:bg-gray-400" />
                        </div>
                     </div>
                     <span className="block w-full p-2 text-center font-normal">System</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="sharing">
          <Card>
            <CardHeader>
              <CardTitle>Share Public Profile</CardTitle>
              <CardDescription>
                Generate a secure, read-only link to your trading dashboard. The link will expire after 10 minutes and can only be used once.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Button onClick={handleGenerateLink} disabled={isGeneratingLink}>
                    {isGeneratingLink ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                    {isGeneratingLink ? "Generating Link..." : "Generate Secure Link"}
                 </Button>

                {shareableLink && (
                    <div className="space-y-2 pt-4">
                        <Label htmlFor="share-link">Your Secure Sharable Link</Label>
                        <p className="text-sm text-muted-foreground">This link is valid for 10 minutes.</p>
                        <div className="flex gap-2">
                            <Input id="share-link" type="text" readOnly value={shareableLink} className="bg-muted"/>
                            <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy link">
                                <Copy className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your application data. Be careful, these actions are irreversible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border border-destructive/50 p-4">
                <div className="mb-4 sm:mb-0">
                  <h3 className="font-semibold text-destructive">Delete All Trades</h3>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete all your trade data from our servers.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">Delete All Data</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your trades.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAllTrades} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Yes, delete all trades
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
