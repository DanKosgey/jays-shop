# Admin Users API Fix

## Problem Identified

The admin users API endpoint was failing with the error:
```
column profiles.full_name does not exist
```

This occurred because:
1. The API was trying to select a `full_name` column from the `profiles` table
2. The `profiles` table schema does not contain a `full_name` column
3. User names are stored in the `auth.users` table's `user_metadata` field instead

## Root Cause Analysis

Looking at the database schema in `supabase/migrations/001_combined_schema.sql`, the `profiles` table only has these columns:
- id
- email
- role
- password_changed_at
- created_at

The `full_name` column does not exist in the `profiles` table. User profile information like names are stored in the `auth.users` table's `user_metadata` JSON field.

## Solution Implemented

Updated the admin users API endpoint (`src/app/api/admin/users/route.ts`) to:

1. **Join auth.users table**: Properly join the `auth.users` table to access user metadata
2. **Extract full_name correctly**: Get the full name from `user_metadata.full_name` 
3. **Provide fallbacks**: Use email username as fallback when full name is not available
4. **Transform data**: Map the joined data to the expected response format

### Key Changes

```typescript
// Before (incorrect):
.select(`
  id,
  email,
  role,
  full_name,  // This column doesn't exist!
  phone,
  created_at
`)

// After (correct):
.select(`
  id,
  email,
  role,
  created_at,
  user:auth.users (
    user_metadata
  )
`)
```

And then transform the data:
```typescript
const transformedUsers = users?.map(profile => ({
  id: profile.id,
  email: profile.email,
  role: profile.role,
  full_name: profile.user?.user_metadata?.full_name || profile.email?.split('@')[0] || 'User',
  phone: profile.user?.user_metadata?.phone || null,
  created_at: profile.created_at
})) || [];
```

## Implementation Details

### Files Modified
1. `src/app/api/admin/users/route.ts` - Fixed the SELECT query and data transformation

### Changes Made
1. **Removed non-existent column**: Eliminated `full_name` from the SELECT statement
2. **Added join**: Joined `auth.users` table to access user metadata
3. **Added transformation**: Mapped the joined data to include `full_name` in the response
4. **Added fallbacks**: Provided email-based fallback when full name is not available
5. **Preserved structure**: Maintained the same response structure for frontend compatibility

## Testing

To verify the fix:

1. Navigate to the admin settings page
2. Check that the users table loads without errors
3. Verify that user names display correctly (from full_name or email)
4. Confirm no more "column profiles.full_name does not exist" errors in the console

## Benefits

1. **Fixes the error**: Eliminates the 500 server error when fetching users
2. **Proper data access**: Correctly accesses user names from the right location
3. **Backward compatibility**: Maintains the same API response structure
4. **Robust handling**: Provides fallbacks when user metadata is incomplete

## Future Improvements

1. **PUT Endpoint**: Consider implementing a PUT endpoint for updating user information
2. **Enhanced Error Handling**: Add more detailed error logging
3. **Pagination Optimization**: Improve pagination handling for large user sets
4. **Caching**: Implement caching for better performance

## Verification

After implementing this fix:
- The admin users API should return a 200 status instead of 500
- User names should display correctly in the admin settings page
- No more database column errors in the console
- Improved reliability of the admin user management feature