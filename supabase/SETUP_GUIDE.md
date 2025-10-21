# Phone Repair Shop - Supabase Backend Setup Guide

## 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your Project URL and anon key from the project settings
3. Create a `.env.local` file in your project root with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 2. Database Schema Setup

### 2.1 Run Initial Migrations

1. Navigate to the Supabase SQL Editor in your dashboard
2. Run the migration files in the following order:
   - `supabase/migrations/003_initial_schema.sql`
   - `supabase/migrations/004_rls_policies.sql`
   - `supabase/migrations/005_storage_buckets.sql`
   - `supabase/migrations/006_indexes_optimization.sql`
   - `supabase/migrations/007_views.sql`
   - `supabase/migrations/008_stored_procedures.sql`

### 2.2 Verify Tables Creation

After running the migrations, verify that the following tables were created:
- `profiles` - User profiles linked to auth.users
- `products` - Product catalog
- `tickets` - Repair tickets
- `orders` - Customer orders
- `order_items` - Junction table for orders and products
- `customers` - Customer information

## 3. Authentication Setup

### 3.1 Enable Authentication Providers

1. In the Supabase dashboard, go to Authentication > Settings
2. Enable Email authentication
3. Optionally enable other providers (Google, GitHub, etc.)

### 3.2 Configure Email Templates

1. Customize the email templates for sign up confirmation and password reset
2. Ensure the redirect URLs point to your application

## 4. Storage Configuration

### 4.1 Verify Storage Buckets

The following storage buckets should be automatically created:
- `avatars` - For user profile pictures
- `user-content` - For user-generated content
- `public-assets` - For publicly accessible assets

### 4.2 Storage Policies

The migration scripts include storage policies that should be automatically applied:
- Users can upload and manage their own avatars
- Users can upload and manage their own content
- Admins can manage public assets
- Anyone can view public assets and avatars

## 5. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 6. Install Dependencies

Install the required dependencies:

```bash
npm install
```

## 7. Run the Application

Start the development server:

```bash
npm run dev
```

The application should now be running on `http://localhost:9002`

## 8. Testing the Setup

### 8.1 Verify Database Connection

1. Check that the application can connect to the Supabase database
2. Verify that all tables exist with the correct schema

### 8.2 Test Authentication

1. Try signing up a new user
2. Verify that a profile is automatically created
3. Test signing in with the new user
4. Test signing out

### 8.3 Test CRUD Operations

1. Create a new product
2. Create a new repair ticket
3. Create a new order
4. Verify that all operations work correctly

### 8.4 Test Storage

1. Upload an avatar image
2. Verify that the image is stored in the correct bucket
3. Retrieve and display the image
4. Delete the image and verify it's removed

## 9. Production Deployment

### 9.1 Environment Variables

Make sure to set the same environment variables in your production environment.

### 9.2 Supabase Settings

1. Update the site URL in Supabase Authentication settings
2. Update the redirect URLs for OAuth providers if needed

### 9.3 Additional Security

1. Review and tighten RLS policies if needed
2. Set up proper email templates for production
3. Configure rate limiting if necessary