"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Search, 
  Eye, 
  Mail, 
  Phone,
  User,
  Users,
  Menu,
  PlusCircle,
  Edit,
  Trash2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "../components/mobile-nav";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Fetch customers from the API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/customers?search=${search}`);
        if (!response.ok) throw new Error('Failed to fetch customers');
        const data = await response.json();
        setCustomers(data.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [search]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const handleCreateCustomer = async () => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create customer');
      
      const newCustomer = await response.json();
      setCustomers([newCustomer, ...customers]);
      setIsCreateDialogOpen(false);
      setFormData({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleUpdateCustomer = async () => {
    try {
      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, id: selectedCustomer.id }),
      });

      if (!response.ok) throw new Error('Failed to update customer');
      
      const updatedCustomer = await response.json();
      setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
      setFormData({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      const response = await fetch(`/api/customers?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete customer');
      
      setCustomers(customers.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const openEditDialog = (customer: any) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || ""
    });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedCustomer(null);
    setFormData({ name: "", email: "", phone: "" });
    setIsCreateDialogOpen(true);
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
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        </div>
      </header>

      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <CardTitle>Customer Directory</CardTitle>
                <CardDescription>Manage and view all your customers.</CardDescription>
              </div>
              <div className="relative flex-1 sm:ml-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8 h-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button onClick={openCreateDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : customers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No customers found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding a new customer.
                </p>
                <Button onClick={openCreateDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Total Spent</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Order</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${customer.id}`} alt={customer.name} />
                            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground md:hidden">{customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{customer.phone || 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{customer.totalOrders}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        Ksh{customer.totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {customer.lastOrder || 'N/A'}
                      </TableCell>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditDialog(customer)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Customer
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
      </main>

      {/* Create/Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen || isCreateDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsEditDialogOpen(false);
          setIsCreateDialogOpen(false);
          setSelectedCustomer(null);
          setFormData({ name: "", email: "", phone: "" });
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedCustomer ? "Edit Customer" : "Create Customer"}</DialogTitle>
            <DialogDescription>
              {selectedCustomer 
                ? "Make changes to the customer's information." 
                : "Add a new customer to your directory."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <div className="col-span-3">
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={selectedCustomer ? handleUpdateCustomer : handleCreateCustomer}
            >
              {selectedCustomer ? "Save Changes" : "Create Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}