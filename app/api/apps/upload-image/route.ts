import { ensureUserProfile } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Body size limit is configured in next.config.ts via experimental.proxyClientMaxBodySize
export const maxDuration = 60; // 1 minute for image uploads

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await ensureUserProfile();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userData || userData.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const appId = formData.get("appId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // AppId is required for image uploads
    if (!appId) {
      return NextResponse.json(
        { error: "App ID is required. Please save the app first, then upload the image." },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Invalid file type. Only image files (JPG, PNG, WebP, GIF) are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for images)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Generate unique file name
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${sanitizedFileName}`;
    const filePath = `apps/${appId}/${fileName}`;

    // Check if there's an existing image and delete it
    const { data: existingApp } = await supabase
      .from("apps")
      .select("image_path")
      .eq("id", appId)
      .single();

    if (existingApp?.image_path) {
      // Delete old image from storage
      const { error: deleteError } = await supabase.storage
        .from("app-image")
        .remove([existingApp.image_path]);
      
      if (deleteError) {
        console.warn("Warning: Failed to delete old image:", deleteError.message);
        // Continue with upload even if old image deletion fails
      }
    }

    // Upload file to Supabase Storage
    // Supabase accepts File, Blob, ArrayBuffer, or Uint8Array
    // Using File directly for consistency with other upload routes
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("app-image")
      .upload(filePath, file, {
        contentType: file.type || `image/${fileExtension}`,
        upsert: false,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      // Check if it's a duplicate file error
      if (uploadError.message?.includes('already exists')) {
        // Try with a new timestamp
        const retryTimestamp = Date.now();
        const retryFileName = `${retryTimestamp}_${sanitizedFileName}`;
        const retryFilePath = `apps/${appId}/${retryFileName}`;
        
        const { data: retryUploadData, error: retryUploadError } = await supabase.storage
          .from("app-image")
          .upload(retryFilePath, file, {
            contentType: file.type || `image/${fileExtension}`,
            upsert: false,
            cacheControl: '3600',
          });

        if (retryUploadError) {
          return NextResponse.json(
            { error: `Upload failed: ${retryUploadError.message}` },
            { status: 500 }
          );
        }

        // Use the retry path if successful
        const { data: retryUrlData } = supabase.storage
          .from("app-image")
          .getPublicUrl(retryFilePath);

        const { error: retryUpdateError } = await supabase
          .from("apps")
          .update({
            image_path: retryFilePath,
            image_url: retryUrlData.publicUrl,
          })
          .eq("id", appId);

        if (retryUpdateError) {
          // Check if it's a schema cache issue
          if (retryUpdateError.message?.includes("image_url") || retryUpdateError.message?.includes("schema cache")) {
            // Try fallback with just image_path
            const { error: fallbackError } = await supabase
              .from("apps")
              .update({ image_path: retryFilePath })
              .eq("id", appId);
            
            if (fallbackError) {
              await supabase.storage.from("app-image").remove([retryFilePath]);
              return NextResponse.json(
                { 
                  error: `Failed to update app. Please run the migration to add the image_url column: ${retryUpdateError.message}`,
                  migrationHint: "Run the SQL in database/migration-add-image-url.sql in your Supabase SQL Editor"
                },
                { status: 500 }
              );
            }
            
            // Return success with warning
            return NextResponse.json({
              success: true,
              filePath: retryFilePath,
              fileName: file.name,
              publicUrl: retryUrlData.publicUrl,
              warning: "image_url column missing - only image_path was updated. Please run migration."
            });
          }
          
          await supabase.storage.from("app-image").remove([retryFilePath]);
          return NextResponse.json(
            { error: `Failed to update app: ${retryUpdateError.message}` },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          filePath: retryFilePath,
          fileName: file.name,
          publicUrl: retryUrlData.publicUrl,
        });
      }

      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("app-image")
      .getPublicUrl(filePath);

    // Update the app record with image information
    // First try to update with both columns
    let updateData: any = {
      image_path: filePath,
      image_url: urlData.publicUrl,
    };
    
    const { error: updateError } = await supabase
      .from("apps")
      .update(updateData)
      .eq("id", appId);

    if (updateError) {
      // If update fails due to missing column, try to add it first
      if (updateError.message?.includes("image_url") || updateError.message?.includes("schema cache")) {
        console.warn("Schema cache issue detected, attempting to refresh...");
        
        // Try updating with just image_path first (in case image_url column doesn't exist yet)
        const { error: fallbackError } = await supabase
          .from("apps")
          .update({ image_path: filePath })
          .eq("id", appId);
        
        if (fallbackError) {
          // If both fail, delete the uploaded file
          await supabase.storage.from("app-image").remove([filePath]);
          return NextResponse.json(
            { 
              error: `Failed to update app. Please run the migration to add the image_url column: ${updateError.message}`,
              migrationHint: "Run the SQL in database/migration-add-image-url.sql in your Supabase SQL Editor"
            },
            { status: 500 }
          );
        }
        
        // If fallback succeeded, warn that image_url wasn't set
        console.warn("image_url column missing - only image_path was updated. Please run migration.");
      } else {
        // If update fails for other reasons, delete the uploaded file
        await supabase.storage.from("app-image").remove([filePath]);
        return NextResponse.json(
          { error: `Failed to update app: ${updateError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      filePath,
      fileName: file.name,
      publicUrl: urlData.publicUrl,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { supabase, user } = await ensureUserProfile();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userData || userData.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get("appId");

    if (!appId) {
      return NextResponse.json(
        { error: "App ID is required" },
        { status: 400 }
      );
    }

    // Get app's image path
    const { data: app } = await supabase
      .from("apps")
      .select("image_path")
      .eq("id", appId)
      .single();

    if (app?.image_path) {
      // Delete image from storage
      const { error: deleteError } = await supabase.storage
        .from("app-image")
        .remove([app.image_path]);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        // Continue with database update even if storage deletion fails
        // The image might have already been deleted or not exist
      }
    }

    // Update app record to remove image
    const { error: updateError } = await supabase
      .from("apps")
      .update({
        image_path: null,
        image_url: null,
      })
      .eq("id", appId);

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to remove image: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}







