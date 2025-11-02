# Complete Setup Guide - Admin-Enabled Portfolio Website

This guide will walk you through setting up your portfolio website with full admin capabilities.

## Overview

Your website now has:
- **Public Website**: Viewable by anyone
- **Admin Panel**: Only accessible by admin users
- **Role-based Access**: Admin vs Normal user
- **Content Management**: Edit all sections from one page
- **Message Management**: View and respond to contact form messages

## Step 1: Database Setup

### 1.1 Run the Database Schema

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `database/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run**

This will create:
- Users table with role-based access
- Site content table for managing website sections
- Apps table for portfolio apps
- Messages table for contact form submissions
- Security policies (RLS)
- Auto-triggers

### 1.2 Initial Admin Setup

After running the schema, you need to make yourself an admin:

1. Run this SQL query in the SQL Editor (replace with your email):

```sql
-- Make your first user an admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

2. Or use the provided script: `database/make-admin.sql`

## Step 2: Sign Up for an Account

1. Go to `/auth/sign-up` on your website
2. Create an account with your email
3. The account will automatically be created as a 'user' role
4. Use the SQL query above to change your role to 'admin'

## Step 3: Access the Admin Panel

1. Login to your account
2. You'll now see **"Admin"** in the navigation (only visible to admins)
3. Click on "Admin" or go to `/admin`

## Admin Features

### Dashboard (`/admin`)
- View statistics (total messages, apps, etc.)
- Quick access cards
- Unread message count

### Content Management (`/admin/content`)
Edit all website content from one page:

1. **Profile Information**: Name and avatar
2. **Home Section**: Title, subtitle, description
3. **About Section**: About text
4. **My Apps**: Add, edit, delete portfolio apps
5. **Contact Information**: Email and description

All sections can be collapsed/expanded. Click the chevron to toggle.

### Messages (`/admin/messages`)
- View all messages from the contact form
- See unread message count
- Read message details
- Respond to messages
- Delete messages

## Step 4: Understanding the Database

### Users Table
Stores user accounts with roles:
- `role`: 'admin' or 'user' (default: 'user')
- Only admins can access `/admin/*` routes

### Site Content Table
Manages dynamic website content:
- Each section has a unique `section_name`
- Content is stored in JSON format for flexibility
- Sections: `home_hero`, `about`, `contact`

### Apps Table
Your portfolio apps:
- All fields editable in admin panel
- Can add new apps or delete existing ones

### Messages Table
Contact form submissions:
- Only admins can view
- Can mark as read/replied
- Store admin responses

## Security Features

1. **Row Level Security (RLS)**: Enforced on all tables
2. **Admin-only routes**: Layout-level protection
3. **Role checking**: Every admin page verifies admin role
4. **Public content**: Anyone can view site content and apps
5. **Protected messages**: Only admins can view contact form messages

## How Content Works

### Public Website
All sections load content from the database:
- `HomeHero` - Loads from `site_content` where `section_name = 'home_hero'`
- `AboutSection` - Loads from `site_content` where `section_name = 'about'`
- `AppsSection` - Loads from `apps` table
- `Footer/Contact` - Loads from `site_content` where `section_name = 'contact'`

### Admin Edits
When you edit content in the admin panel:
1. Changes are saved to the database
2. The page automatically refreshes
3. Public website immediately shows the new content

## Customization

### Adding New Sections
1. Add a new row in `site_content` table
2. Create a section component that fetches from the database
3. Add editing capability in the admin content manager

### Modifying Admin Features
- `components/admin/content-manager.tsx` - Content editing UI
- `components/admin/messages-list.tsx` - Messages UI
- `app/admin/*` - Admin pages and routes

## Troubleshooting

### Can't Access Admin Panel
- Make sure you updated your role to 'admin' in the database
- Try logging out and back in
- Check browser console for errors

### Changes Not Showing
- Ensure the database update was successful
- Try hard refresh (Ctrl+Shift+R)
- Check that you're logged in as admin

### Permission Errors
- Run the complete schema SQL again
- Check RLS policies in Supabase dashboard
- Verify table permissions

### Message Not Saving
- Check that the `messages` table exists
- Verify RLS policies allow INSERT
- Check API route is working (`/api/contact`)

## API Routes

- `POST /api/contact` - Saves contact form messages to database

## Environment Variables

Make sure these are set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

## Next Steps

1. Run the database schema
2. Make your account an admin
3. Login and access the admin panel
4. Customize your website content
5. Start collecting messages!

## Support

If you encounter issues:
1. Check the Supabase dashboard for database errors
2. Check browser console for JavaScript errors
3. Verify all environment variables are set
4. Make sure you ran the complete schema SQL









