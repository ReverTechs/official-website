# Image Upload Fix - Summary

## Issues Found and Fixed

### 1. **Missing Database Column** (Primary Issue)
The `image_path` column was missing from the main `database/schema.sql` file. This column is required for the image upload feature to work. When an admin tried to upload an image, the database UPDATE query would fail because the column didn't exist.

**Fixed:**
- Updated `database/schema.sql` to include `image_path` and other file storage columns (`file_path`, `file_name`, `file_size`, `file_type`)
- Made `download_link` nullable
- Added the constraint ensuring either `download_link` or `file_path` is set

### 2. **Missing image_path in saveApp Function**
The `saveApp` function wasn't preserving `image_path` when saving app data. This meant that if you saved an app after uploading an image, the `image_path` might not be persisted.

**Fixed:**
- Updated `saveApp` function in `components/admin/content-manager.tsx` to include `image_path` when saving app data

### 3. **State Not Syncing After Refresh**
After image upload and page refresh, the component state wasn't syncing with the updated props from the database.

**Fixed:**
- Added `useEffect` hook to sync `appsData` state with props when apps data changes after refresh

### 4. **Image Display Issues**
The UI didn't properly display uploaded images and distinguish them from external URLs.

**Fixed:**
- Improved image display logic to show uploaded images with file info
- Added support for displaying external image URLs separately
- Added error handling for image loading failures

### 5. **Migration File Improvements**
The migration file `database/migration-add-file-storage.sql` has been improved to:
- Handle cases where columns already exist
- Safely handle constraint creation/dropping
- Can be run multiple times without errors

## What You Need to Do

### Step 1: Run the Migration (If Database Already Exists)
If your database was created before this fix, you need to run the migration:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database/migration-add-file-storage.sql`
4. Click **"Run"**

This will add the missing columns to your existing database.

### Step 2: Verify Storage Bucket Setup
Ensure the `app-image` storage bucket exists and has proper policies:

1. Go to **Storage** in Supabase Dashboard
2. Verify `app-image` bucket exists
3. Ensure it's marked as **Public**
4. Check that storage policies are set up (see `database/storage-setup.md`)

### Step 3: Verify Storage Policies
Make sure these policies exist for the `app-image` bucket:

**Policy 1: Allow Admins to Upload Images**
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

**Policy 2: Allow Public Read Access**
```sql
CREATE POLICY "Public can view app images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'app-image');
```

**Policy 3: Allow Admins to Delete Images**
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

## Testing the Fix

After running the migration:

1. Go to `/admin/content` in your app
2. Expand the "My Apps" section
3. Create or edit an app (make sure to save it first)
4. Try uploading an image
5. The image should now upload successfully

## Common Error Messages and Solutions

### "Failed to update app: column 'image_path' does not exist"
- **Solution:** Run the migration file `database/migration-add-file-storage.sql`

### "Upload failed: Permission denied"
- **Solution:** 
  - Verify storage bucket policies are set up correctly
  - Ensure your user has the `admin` role in the `users` table
  - Check that the `app-image` bucket exists

### "Failed to update app: null value in column 'download_link'"
- **Solution:** Make sure you've run the migration which makes `download_link` nullable

## Files Modified

1. `database/schema.sql` - Added missing columns to apps table (`image_path`, `file_path`, `file_name`, `file_size`, `file_type`)
2. `database/migration-add-file-storage.sql` - Improved to handle edge cases and be idempotent
3. `components/admin/content-manager.tsx` - Fixed multiple issues:
   - Added `image_path` preservation in `saveApp` function
   - Added `useEffect` to sync state with props after refresh
   - Improved image display UI to show uploaded images properly
   - Added support for displaying external image URLs separately

## Summary

The main issues were:
1. **Database schema**: Missing `image_path` column (fixed in schema.sql)
2. **State management**: `saveApp` wasn't preserving `image_path` (now fixed)
3. **UI sync**: State wasn't updating after page refresh (now fixed with useEffect)
4. **Display**: Images weren't showing properly in the admin UI (now improved)

After running the database migration, all these fixes will ensure that:
- Images can be uploaded successfully
- Image data is saved to the database correctly
- Images are displayed in the admin interface after upload
- Images persist after page refresh

