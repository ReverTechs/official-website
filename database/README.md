# Database Setup Instructions

This guide will help you set up the database for your admin-powered website.

## Prerequisites

- Supabase account and project
- Database access to your Supabase project

## Step 1: Run the Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the query

The schema will create:
- Users table with role-based access
- Site content table for managing website content
- Apps table for portfolio apps
- Messages table for contact form submissions
- Row Level Security (RLS) policies
- Automatic triggers for `updated_at` timestamps

## Step 2: Set Up Your Admin User

After running the schema, you need to make your first user an admin.

1. Sign up for an account through the `/auth/sign-up` page
2. Once registered, run this SQL query in your Supabase SQL Editor:

```sql
-- Update your email here
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

Replace `your-email@example.com` with the email you used to sign up.

## Step 3: Verify Setup

1. Login to your account
2. You should now see an "Admin" link in the navbar (only if you're an admin)
3. Navigate to `/admin` to access the admin dashboard

## Features Available

### Admin Dashboard (`/admin`)
- View statistics (messages, apps, etc.)
- Quick access to all admin features

### Content Management (`/admin/content`)
- Edit profile information (name, avatar)
- Edit home section (title, subtitle, description)
- Edit about section
- Manage apps (add, edit, delete)
- Edit contact information

### Messages (`/admin/messages`)
- View all messages from the contact form
- Respond to messages
- Delete messages
- See unread message count

## Database Structure

### Users Table
- `id` (UUID) - Primary key, references auth.users
- `email` (TEXT) - User email
- `full_name` (TEXT) - Display name
- `role` (TEXT) - Either 'admin' or 'user'
- `avatar_url` (TEXT) - Profile picture URL

### Site Content Table
- `id` (UUID) - Primary key
- `section_name` (TEXT) - Unique section identifier
- `title` (TEXT) - Section title
- `subtitle` (TEXT) - Section subtitle
- `description` (TEXT) - Section description
- `content` (JSONB) - Flexible content storage
- `metadata` (JSONB) - Additional metadata

### Apps Table
- `id` (UUID) - Primary key
- `title` (TEXT) - App title
- `description` (TEXT) - App description
- `category` (TEXT) - App category
- `download_link` (TEXT) - Link to download
- `image_url` (TEXT) - App image
- `tags` (TEXT[]) - Array of tags
- `display_order` (INTEGER) - Order in the list

### Messages Table
- `id` (UUID) - Primary key
- `name` (TEXT) - Sender name
- `email` (TEXT) - Sender email
- `subject` (TEXT) - Message subject
- `message` (TEXT) - Message content
- `replied_at` (TIMESTAMPTZ) - When admin responded
- `admin_response` (TEXT) - Admin's response
- `created_at` (TIMESTAMPTZ) - When message was sent

## Security

All tables have Row Level Security (RLS) enabled:
- Public can read content and apps
- Only admins can modify content and apps
- Only admins can view and respond to messages
- Anyone can submit a message through the contact form

## Troubleshooting

### Can't access admin panel
- Make sure you updated your user role to 'admin' in the database
- Refresh your session by logging out and back in

### Permission errors
- Check that you ran the complete schema SQL
- Verify RLS policies are in place

### Data not showing
- Ensure initial data was inserted by the schema
- Check Supabase dashboard for any errors







