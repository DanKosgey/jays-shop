import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [shopSettings, setShopSettings] = useState({
    name: "Phone Repair Pro",
    tagline: "Expert Repairs, Trusted Service",
    email: "contact@phonerepairpro.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    hours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
    logo: "",
    primaryColor: "#3B82F6",
    accentColor: "#10B981",
    notificationsEnabled: true,
    autoEmailOnStatusChange: true,
    lowStockThreshold: 5,
    ticketPrefix: "TKT",
    currency: "USD",
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your shop settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your shop settings and preferences</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shop Information</CardTitle>
              <CardDescription>Basic information about your repair shop</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Shop Name</Label>
                <Input
                  id="name"
                  value={shopSettings.name}
                  onChange={(e) => setShopSettings({ ...shopSettings, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={shopSettings.tagline}
                  onChange={(e) => setShopSettings({ ...shopSettings, tagline: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shopSettings.email}
                    onChange={(e) => setShopSettings({ ...shopSettings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={shopSettings.phone}
                    onChange={(e) => setShopSettings({ ...shopSettings, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={shopSettings.address}
                  onChange={(e) => setShopSettings({ ...shopSettings, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Business Hours</Label>
                <Textarea
                  id="hours"
                  value={shopSettings.hours}
                  onChange={(e) => setShopSettings({ ...shopSettings, hours: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Customization</CardTitle>
              <CardDescription>Customize your shop's look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Shop Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={shopSettings.primaryColor}
                      onChange={(e) => setShopSettings({ ...shopSettings, primaryColor: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input value={shopSettings.primaryColor} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={shopSettings.accentColor}
                      onChange={(e) => setShopSettings({ ...shopSettings, accentColor: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input value={shopSettings.accentColor} readOnly />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about shop activity</p>
                </div>
                <Switch
                  checked={shopSettings.notificationsEnabled}
                  onCheckedChange={(checked) => setShopSettings({ ...shopSettings, notificationsEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-email on Status Change</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send emails when ticket status changes
                  </p>
                </div>
                <Switch
                  checked={shopSettings.autoEmailOnStatusChange}
                  onCheckedChange={(checked) =>
                    setShopSettings({ ...shopSettings, autoEmailOnStatusChange: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStock">Low Stock Alert Threshold</Label>
                <Input
                  id="lowStock"
                  type="number"
                  value={shopSettings.lowStockThreshold}
                  onChange={(e) => setShopSettings({ ...shopSettings, lowStockThreshold: parseInt(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Advanced configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketPrefix">Ticket Number Prefix</Label>
                  <Input
                    id="ticketPrefix"
                    value={shopSettings.ticketPrefix}
                    onChange={(e) => setShopSettings({ ...shopSettings, ticketPrefix: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={shopSettings.currency}
                    onChange={(e) => setShopSettings({ ...shopSettings, currency: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
