# Database Migration Guide

This guide explains how to apply the customer-order relationship migration to your local database.

## Overview

We've added a direct foreign key relationship between customers and orders to enable efficient querying of customer data with related orders. This resolves the previous API error where the system couldn't find a relationship between customers and orders.

## Changes Made

1. Added `customer_id` column to the `orders` table with a foreign key reference to `customers(id)`
2. Created an index on the new `customer_id` column for better query performance
3. Updated existing orders to link to customers where possible based on `user_id`
4. Updated the customers API to use the new relationship

## Applying the Migration

### Option 1: Automated Migration (Recommended)

Run the automated migration script:

```bash
npm run migrate:local
```

This script will:
1. Add the `customer_id` column to the orders table
2. Create the necessary index
3. Update existing orders to link to customers
4. Test the new relationship

### Option 2: Manual SQL Migration

If the automated migration doesn't work, you can apply the migration manually:

1. Open the Supabase SQL Editor
2. Run the SQL commands from `supabase/migrations/014_add_customer_order_relationship_manual.sql`

## Verifying the Migration

After applying the migration, you can verify it worked by:

1. Checking that the `customer_id` column exists in the `orders` table
2. Confirming that some orders have been linked to customers
3. Testing the customers API endpoint which should now work without errors

## Rollback (If Needed)

If you need to rollback the migration, you can run:

```sql
ALTER TABLE public.orders DROP COLUMN IF EXISTS customer_id;
```

Note that this will remove the relationship and may affect the customers API functionality.