# End-to-End Product Management Workflow Test Plan

## Overview
This document outlines the steps to test the complete product management workflow for the phone repair shop application, including:
1. Admin product creation with image upload
2. Customer product viewing in the shop
3. Admin product editing
4. Admin product deletion

## Prerequisites
- Application running on http://localhost:9003
- Supabase backend properly configured
- Admin user account created and logged in

## Test Steps

### 1. Admin Product Creation with Image Upload

1. Navigate to http://localhost:9003/admin/products
2. Click "Add Product" button
3. Fill in product details:
   - Name: "Test Phone Case"
   - Category: "Accessories"
   - Price: "1500"
   - Stock Quantity: "25"
   - Description: "High-quality phone case for latest models"
4. Select an image file for upload
5. Click "Add New Product"
6. Verify:
   - Product appears in the products table
   - Image is properly displayed in the table
   - Product details are correct

### 2. Customer Product Viewing in Shop

1. Navigate to http://localhost:9003/shop
2. Verify:
   - The newly created product appears in the product grid
   - Product image is displayed correctly
   - Product name, price, and category are shown
   - Clicking "View" navigates to the product detail page

### 3. Admin Product Editing

1. Navigate to http://localhost:9003/admin/products
2. Find the "Test Phone Case" product in the table
3. Click the "Edit" action for that product
4. Modify some details:
   - Change price to "1400"
   - Change stock quantity to "30"
   - Select a different image
5. Click "Save Changes"
6. Verify:
   - Product details are updated in the table
   - New image is displayed
   - Updated values are reflected

### 4. Admin Product Deletion

1. Navigate to http://localhost:9003/admin/products
2. Find the "Test Phone Case" product in the table
3. Click the "Delete" action for that product
4. Confirm deletion in the dialog
5. Verify:
   - Product is removed from the products table
   - Product no longer appears in the shop page

## Expected Results

All test steps should complete successfully with:
- No errors in the browser console
- No errors in the terminal logs
- Proper data persistence in the Supabase database
- Correct image handling in the Supabase storage bucket
- Consistent data display between admin and customer interfaces

## Troubleshooting

If any issues are encountered:
1. Check browser console for JavaScript errors
2. Check terminal for backend errors
3. Verify Supabase database connectivity
4. Confirm storage bucket permissions
5. Ensure environment variables are properly set