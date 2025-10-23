"use client";

import { useState, useEffect } from "react";
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
  Menu,
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "../components/mobile-nav";
// Import the LogViewer component
import { LogViewer } from "../components/log-viewer";
import { PageLogger } from "../components/page-logger";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  const [shopName, setShopName] = useState("Jay's Phone Repair");
  const [shopEmail, setShopEmail] = useState("info@jaysphonerepair.com");
  const [shopPhone, setShopPhone] = useState("+254 700 123 456");
  const [shopAddress, setShopAddress] = useState("123 Tech Street, Nairobi, Kenya");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({
    id: '',
    full_name: '',
    email: '',
    role: 'user',
    phone: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        console.log('[ADMIN_SETTINGS] Fetching users from API');
        const res = await fetch('/api/admin/users');
        console.log('[ADMIN_SETTINGS] API response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('[ADMIN_SETTINGS] API error response:', errorText);
          throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('[ADMIN_SETTINGS] API success response:', data);
        setUsers(data.users);
      } catch (error) {
        console.error('[ADMIN_SETTINGS] Error fetching users:', error);
        // Display error to user
        alert(`Error fetching users: ${(error as Error).message}`);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Settings saved");
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditingUser({
      id: user.id,
      full_name: user.full_name || '',
      email: user.email || '',
      role: user.role || 'user',
      phone: user.phone || ''
    });
    setIsEditUserDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      // Refresh users list
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
      
      setIsEditUserDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Add page logger for tracking access */}
      <PageLogger pageName="settings" />
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
        <div className="grid gap-6">
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

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and their roles in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="text-center py-4">Loading users...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>{user.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <div className="grid gap-6 md:grid-cols-2">
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

        {/* Log Viewer */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>
              View recent activity and security events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LogViewer />
          </CardContent>
        </Card>
      </main>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user's information and role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-user-name">Full Name</Label>
              <Input
                id="edit-user-name"
                value={editingUser.full_name}
                onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-user-email">Email</Label>
              <Input
                id="edit-user-email"
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-user-phone">Phone</Label>
              <Input
                id="edit-user-phone"
                value={editingUser.phone}
                onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-user-role">Role</Label>
              <Select 
                value={editingUser.role} 
                onValueChange={(value) => setEditingUser({...editingUser, role: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}