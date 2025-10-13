"use client";

import { AdminHeader } from "../components/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader title="Settings" />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Shop Information</CardTitle>
              <CardDescription>Update your shop's public details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="shop-name">Shop Name</Label>
                <Input id="shop-name" defaultValue="Jay's phone repair shop" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shop-address">Address</Label>
                <Input id="shop-address" defaultValue="123 Tech Street, Silicon Valley, CA 94000" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="shop-email">Email</Label>
                  <Input id="shop-email" type="email" defaultValue="support@jaysphonerepair.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="shop-phone">Phone</Label>
                  <Input id="shop-phone" type="tel" defaultValue="(123) 456-7890" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>AI Chatbot</CardTitle>
                <CardDescription>Configure the AI assistant for customer support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="enable-chatbot" className="text-base">Enable Chatbot</Label>
                        <p className="text-sm text-muted-foreground">
                           Make the AI assistant available to customers on the website.
                        </p>
                    </div>
                    <Switch id="enable-chatbot" defaultChecked/>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Textarea 
                        id="system-prompt"
                        placeholder="Define the chatbot's personality and instructions..."
                        className="min-h-[200px]"
                        defaultValue={`You are a helpful AI assistant for a phone repair shop. 

Your capabilities:
- Help customers track their repair status
- Provide repair cost estimates
- Answer questions about products
- Explain shop policies
- Offer troubleshooting advice

Guidelines:
- Be friendly and professional
- If you don't know something, suggest they contact the shop directly
- For specific pricing, provide ranges based on the knowledge base
- Always mention warranty information for repairs
- If customer seems frustrated, be empathetic
- For urgent issues, suggest calling the shop`}
                    />
                     <p className="text-sm text-muted-foreground">
                        This prompt sets the context and guidelines for the AI chatbot's responses.
                    </p>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your personal account details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="admin-name">Name</Label>
                <Input id="admin-name" defaultValue="Admin User" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" defaultValue="admin@jaysphonerepair.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-password">New Password</Label>
                <Input id="admin-password" type="password" placeholder="••••••••" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
