
"use client";

import { AdminHeader } from "../components/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockProducts, mockSecondHandProducts } from "@/lib/mock-data";
import { Product, SecondHandProduct } from "@/lib/types";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function AddSecondHandItemForm() {
    return (
        <form className="grid gap-6 p-1">
            <div className="grid gap-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input id="item-name" placeholder="e.g., Used iPhone 12 Pro" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="item-category">Category</Label>
                <Input id="item-category" placeholder="e.g., Smartphones" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="item-condition">Condition</Label>
                <select id="item-condition" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Fair</option>
                </select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="asking-price">Asking Price (Ksh)</Label>
                <Input id="asking-price" type="number" placeholder="e.g., 60000" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="item-photos">Upload Photos</Label>
                <Input id="item-photos" type="file" multiple className="pt-2"/>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="item-description">Description</Label>
                <textarea id="item-description" placeholder="Describe the item, including any wear and tear." className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"></textarea>
            </div>

            <Button type="submit" className="w-full">Add Product to Marketplace</Button>
        </form>
    )
}

export default function ProductsPage() {

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader title="Products" />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                             <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Second-Hand Product</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Second-Hand Product</DialogTitle>
                            <DialogDescription>
                                Add a new used or refurbished item to the marketplace.
                            </DialogDescription>
                        </DialogHeader>
                        <Separator />
                        <AddSecondHandItemForm />
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add New Product</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                                Fill in the details to add a new product to your inventory.
                            </DialogDescription>
                        </DialogHeader>
                        {/* Add form for new product here */}
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your store's new products and inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.imageUrl}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{product.stockQuantity}</TableCell>
                    <TableCell className="text-right">Ksh{product.price.toFixed(2)}</TableCell>
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Second-Hand Marketplace</CardTitle>
            <CardDescription>Manage products listed on the second-hand marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                   <TableHead>Condition</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSecondHandProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.imageUrl}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.condition}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">Ksh{product.price.toFixed(2)}</TableCell>
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View on Site</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Unlist</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}

    