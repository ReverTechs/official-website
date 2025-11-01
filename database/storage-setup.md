# Supabase Storage Setup Guide

This guide will help you set up the Supabase Storage buckets for app file and image uploads.

## Step 1: Create Storage Buckets

### Bucket 1: app-files (for APK/IPA files)

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

### Bucket 2: app-image (for app images)

1. Still in **Storage**, click **"New bucket"** again
2. Configure the bucket:
   - **Name**: `app-image`
   - **Public bucket**: ✅ Check this (allows public viewing)
   - **File size limit**: 10 MB (or your preferred limit)
   - **Allowed MIME types**: Leave empty or add:
     - `image/jpeg`
     - `image/png`
     - `image/webp`
     - `image/gif`

3. Click **"Create bucket"**

## Step 2: Set Up Storage Policies

After creating the buckets, you need to set up Row Level Security (RLS) policies for both buckets.

### app-files Bucket Policies

Go to **Storage** → **Policies** → **app-files** and add the following policies:

#### Policy 1: Allow Admins to Upload Files

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

#### Policy 2: Allow Public Read Access

```sql
CREATE POLICY "Public can view app files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'app-files');
```

#### Policy 3: Allow Admins to Delete Files

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

### app-image Bucket Policies

Go to **Storage** → **Policies** → **app-image** and add the following policies:

#### Policy 1: Allow Admins to Upload Images

```sql
CREATE POLICY "Admins can upload app images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'app-image' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);
```

#### Policy 2: Allow Public Read Access

```sql
CREATE POLICY "Public can view app images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'app-image');
```

#### Policy 3: Allow Admins to Delete Images

```sql
CREATE POLICY "Admins can delete app images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'app-image' AND
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
- Add `file_path`, `file_name`, `file_size`, `file_type`, and `image_path` columns to the `apps` table
- Make `download_link` nullable
- Add a constraint ensuring either `download_link` or `file_path` is set

## Step 4: Verify Setup

1. Go to `/admin/content` in your app
2. Expand the "My Apps" section
3. Try uploading a test .apk or .ipa file
4. Try uploading a test image (JPG, PNG, etc.)
5. Check that both files appear in their respective Supabase Storage buckets

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

- Files are stored in the `apps/{appId}/` directory structure in both buckets
- File names are sanitized and prefixed with timestamps to prevent conflicts
- When uploading a new image, the old image is automatically deleted
- Old app files (APK/IPA) are not automatically deleted when uploading new ones (you may want to add cleanup logic)
- Image uploads support: JPG, JPEG, PNG, WebP, and GIF formats
- Maximum image size: 10MB
- Maximum app file size: 500MB

