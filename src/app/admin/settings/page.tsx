"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Save, 
  Key, 
  Bell, 
  Palette,
  Shield,
  CreditCard,
  Mail,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "../components/mobile-nav";
// Import the LogViewer component
import { LogViewer } from "../components/log-viewer";

export default function SettingsPage() {
  const [shopName, setShopName] = useState("Jay's Phone Repair");
  const [shopEmail, setShopEmail] = useState("info@jaysphonerepair.com");
  const [shopPhone, setShopPhone] = useState("+254 700 123 456");
  const [shopAddress, setShopAddress] = useState("123 Tech Street, Nairobi, Kenya");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Settings saved");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </header>

      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your shop information and general settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shop-name">Shop Name</Label>
                  <Input
                    id="shop-name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shop-email">Email Address</Label>
                  <Input
                    id="shop-email"
                    type="email"
                    value={shopEmail}
                    onChange={(e) => setShopEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shop-phone">Phone Number</Label>
                  <Input
                    id="shop-phone"
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shop-address">Shop Address</Label>
                  <Textarea
                    id="shop-address"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for important events.
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email.
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    disabled={!notifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS.
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                    disabled={!notifications}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Change Password</Label>
                    <p className="text-sm text-muted-foreground">
                      Update your account password.
                    </p>
                  </div>
                  <Button variant="outline">Change</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Settings Sections */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your admin panel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="w-full">
                  Customize Colors
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
              <CardDescription>
                Configure payment methods and settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="KES">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="w-full">
                  Payment Methods
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email
              </CardTitle>
              <CardDescription>
                Configure email templates and settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Ticket Status Updates
                </Button>
                <Button variant="outline" className="w-full">
                  Order Confirmations
                </Button>
                <Button variant="outline" className="w-full">
                  Password Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Log Viewer */}
        <LogViewer />
      </main>
    </div>
  );
}
