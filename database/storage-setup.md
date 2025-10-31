# Supabase Storage Setup Guide

This guide will help you set up the Supabase Storage bucket for app file uploads.

## Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `app-files`
   - **Public bucket**: ✅ Check this (allows public downloads)
   - **File size limit**: 500 MB (or your preferred limit)
   - **Allowed MIME types**: Leave empty or add:
     - `application/vnd.android.package-archive` (for .apk files)
     - `application/octet-stream` (for .ipa files)

5. Click **"Create bucket"**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies.

### Policy 1: Allow Admins to Upload Files

Go to **Storage** → **Policies** → **app-files** and add a new policy:

```sql
CREATE POLICY "Admins can upload app files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'app-files' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);
```

### Policy 2: Allow Public Read Access

```sql
CREATE POLICY "Public can view app files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'app-files');
```

### Policy 3: Allow Admins to Delete Files

```sql
CREATE POLICY "Admins can delete app files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'app-files' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);
```

## Step 3: Run Database Migration

Run the migration script to add file storage fields to the apps table:

1. Go to **SQL Editor** in Supabase
2. Copy and paste the contents of `database/migration-add-file-storage.sql`
3. Click **"Run"**

This will:
- Add `file_path`, `file_name`, `file_size`, and `file_type` columns to the `apps` table
- Make `download_link` nullable
- Add a constraint ensuring either `download_link` or `file_path` is set

## Step 4: Verify Setup

1. Go to `/admin/content` in your app
2. Expand the "My Apps" section
3. Try uploading a test .apk or .ipa file
4. Check that the file appears in the Supabase Storage bucket

## Troubleshooting

### Upload Fails with "Permission Denied"
- Make sure you've created the storage policies
- Verify your user has the admin role in the `users` table

### Download Doesn't Work
- Check that the bucket is public
- Verify the `file_path` in the database matches the file location in storage
- Check browser console for errors

### File Too Large
- Increase the file size limit in the bucket settings
- Or reduce the max size check in `app/api/apps/upload/route.ts`

## Notes

- Files are stored in the `apps/{appId}/` directory structure
- File names are sanitized and prefixed with timestamps to prevent conflicts
- Old files are not automatically deleted when uploading new ones (you may want to add cleanup logic)

