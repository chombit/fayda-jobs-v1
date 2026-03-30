# Admin Authentication Setup

## Overview
The admin panel now has authentication protection. Only authorized users can access the admin dashboard.

## Setup Instructions

### 1. Create Admin User in Supabase

1. Go to your Supabase Dashboard: https://wpetibtqopmoqxjnxxdz.supabase.co
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"**
4. Create user with:
   - **Email**: `admin@faydajobs.com`
   - **Password**: Set a secure password
   - **Auto-confirm**: Enable this option

### 2. Set Up Admin Roles (Recommended)

1. Go to **SQL Editor** in Supabase Dashboard
2. Run the SQL script from `supabase/setup-admin.sql`
3. This creates an `admin_roles` table for better role management

### 3. Alternative: Email-Based Access (Development)

For quick testing, the system also checks against a hardcoded list of admin emails:
- `admin@faydajobs.com`
- `your-email@domain.com` (add your email for testing)

## Accessing the Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. You'll see a login screen
3. Enter your admin credentials:
   - Email: `admin@faydajobs.com`
   - Password: (the password you set in Supabase)

## Features

- **Secure Authentication**: Uses Supabase Auth
- **Role-Based Access**: Checks admin_roles table
- **Auto-Logout**: Session management
- **Protected Routes**: Admin pages require authentication
- **Fallback System**: Email-based access for development

## Security Notes

- The admin panel is protected by authentication
- Only users with admin role can access
- Sessions are managed securely
- Logout functionality included

## Testing the System

1. Start the development server: `npm run dev`
2. Go to `http://localhost:3000/admin`
3. Try accessing without logging in (should show login)
4. Login with admin credentials
5. Verify you can access the dashboard
6. Test logout functionality

## Troubleshooting

### "Access denied" error
- Check if the user exists in Supabase Auth
- Verify the email is in the admin list or admin_roles table
- Ensure the user is confirmed

### 404 errors
- Make sure the admin page exists at `app/admin/page.tsx`
- Check for syntax errors in the admin files

### Database errors
- Run the SQL setup script
- Check Supabase connection in `.env.local`

## Next Steps

- Add more admin users as needed
- Set up proper admin_roles table
- Add more granular permissions
- Implement audit logging
