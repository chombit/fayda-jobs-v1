# Fayda Jobs Backend Setup Guide

This guide ensures a consistent and modern Supabase setup for Fayda Jobs Ethiopia.

## 🗄️ Database Setup (Fresh Project)

If you are setting up a NEW Supabase project or resetting an existing one:

1. **Open Supabase SQL Editor**: Go to the SQL Editor in your Supabase dashboard.
2. **Run Consolidated Script**: Copy and run the entire content of:
   - `supabase/consolidated-schema.sql`
3. **Wait for Success**: This script sets up all tables, roles, security policies, search optimization, and basic sample categories.

## 🔄 Database Update (Existing Project)

If you already have a project with data and only need the NEW features (Search Optimization, Subscribers tab):

1. **Open Supabase SQL Editor**.
2. **Run Update Script**: Copy and run the content of:
   - `supabase/update-schema.sql`

## 🔑 Admin Role Setup

After running the database setup, you need to grant yourself admin privileges:

1. **Get your User ID**: In Supabase, go to **Authentication** -> **Users** and copy your ID.
2. **Assign Role**: Run the following SQL (replace with your ID):
   ```sql
   INSERT INTO public.user_roles (user_id, role) 
   VALUES ('PASTE_YOUR_ID_HERE', 'admin');
   ```

## 🚀 After Setup:

- ✅ **Jobs Page**: Simple and efficient search using standard SQL queries.
- ✅ **Admin Panel**: You will have a "Subscribers" tab to manage newsletter users.
- ✅ **Type Safety**: All TypeScript helpers are pre-configured to match this schema.

## 📞 Support:
If any step fails, ensure:
1. You ran the Consolidated or Update script first.
2. Your `.env` keys match the current project.
3. You didn't miss the Admin Role Setup step.
