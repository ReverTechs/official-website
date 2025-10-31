# APK/IPA File Upload Feature

This document describes the new file upload feature that allows admins to upload .apk and .ipa files directly from the admin panel.

## Features

✅ **Upload APK/IPA Files**: Admins can upload Android (.apk) and iOS (.ipa) files directly from the admin panel
✅ **Secure Storage**: Files are stored in Supabase Storage with proper access control
✅ **Automatic Downloads**: Users can download files directly from the website with proper file headers
✅ **Database Integration**: File metadata is stored in the database (file path, name, size, type)
✅ **External Link Support**: Still supports external download links for apps not hosted on the platform

## Setup Instructions

### Step 1: Run Database Migration

1. Go to your Supabase SQL Editor
2. Run the migration script: `database/migration-add-file-storage.sql`
3. This adds the necessary columns to the `apps` table:
   - `file_path` - Storage path of the uploaded file
   - `file_name` - Original file name
   - `file_size` - File size in bytes
   - `file_type` - File type (apk, ipa, or external)

### Step 2: Set Up Supabase Storage

Follow the detailed guide in `database/storage-setup.md` to:
1. Create the `app-files` storage bucket
2. Set up storage policies for upload and download access
3. Configure bucket settings

### Step 3: Verify Setup

1. Log into your admin panel at `/admin/content`
2. Expand the "My Apps" section
3. You should now see a file upload area for each app

## How to Use

### For Existing Apps

1. Go to `/admin/content` and expand "My Apps"
2. Find the app you want to upload a file for
3. Click on the upload area (dashed border)
4. Select a .apk or .ipa file
5. The file will upload automatically and the download link will be updated

### For New Apps

1. Create a new app by clicking "Add New App"
2. Fill in at least: Title, Description, and Category
3. Click "Save" to create the app
4. Now you can upload a file using the upload area
5. The file will be associated with the app automatically

### Removing Files

1. If an app has an uploaded file, you'll see the file name displayed
2. Click the "X" button next to the file to remove it
3. The app will revert to using an external download link (if set)

## Technical Details

### File Storage

- Files are stored in Supabase Storage under `app-files` bucket
- Storage path format: `apps/{appId}/{timestamp}_{filename}`
- Maximum file size: 500MB
- Supported formats: `.apk` (Android) and `.ipa` (iOS)

### API Endpoints

- `POST /api/apps/upload` - Upload a file (admin only)
  - Requires: `file` (FormData), `appId` (string)
  - Returns: File metadata and public URL

- `GET /api/apps/download?appId={id}` - Download a file
  - Public endpoint
  - Returns: File with proper headers for download
  - Redirects to external link if no file is uploaded

### Database Schema

The `apps` table now includes:
- `file_path` TEXT - Path in storage
- `file_name` TEXT - Original filename
- `file_size` BIGINT - File size in bytes
- `file_type` TEXT - 'apk', 'ipa', or 'external'
- `download_link` TEXT - Now nullable, can be file URL or external link

### Security

- Only admins can upload files (checked via RLS and API authentication)
- Files are validated for type and size before upload
- Storage policies restrict upload/delete to admins only
- Public read access for downloads

## User Experience

### Download Flow

When a user clicks the "Download" button:

1. If the app has an uploaded file (`file_path` exists):
   - Downloads from `/api/apps/download?appId={id}`
   - File is served with proper `Content-Disposition` headers
   - Browser triggers download with correct filename

2. If the app uses an external link:
   - Opens the external URL in a new tab
   - Works exactly as before

### Admin Experience

- Clean, intuitive upload interface
- Visual feedback during upload
- File information display (name, size, type)
- Easy file removal
- Disabled upload for unsaved apps (prevents errors)

## Troubleshooting

### "App ID is required" error
- Make sure you've saved the app first before uploading
- Fill in at least title, description, and category, then click Save

### Upload fails
- Check that the storage bucket `app-files` exists
- Verify storage policies are set up correctly
- Ensure your user has admin role
- Check file size (max 500MB) and type (.apk or .ipa only)

### Download doesn't work
- Verify the file was uploaded successfully
- Check that the storage bucket is public
- Verify `file_path` in database matches the file in storage
- Check browser console for errors

### File not displaying
- Refresh the page after upload
- Check that the app has been saved with file information
- Verify database columns were added correctly

## Migration Notes

- Existing apps with `download_link` will continue to work
- The migration makes `download_link` nullable
- Apps can have either a file upload OR an external link (not both)
- When a file is uploaded, it automatically sets the `download_link` to the file URL

## Future Enhancements

Potential improvements:
- Support for multiple file versions
- File replacement (delete old file when uploading new one)
- Download analytics
- File integrity checks (checksums)
- Automatic file cleanup for deleted apps

