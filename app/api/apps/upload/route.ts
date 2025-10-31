import { ensureUserProfile } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

    // Validate file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !["apk", "ipa"].includes(fileExtension)) {
      return NextResponse.json(
        { error: "Invalid file type. Only .apk and .ipa files are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 500MB limit" },
        { status: 400 }
      );
    }

    // AppId is required for file uploads
    // If creating a new app, save the app first, then upload the file
    if (!appId) {
      return NextResponse.json(
        { error: "App ID is required. Please save the app first, then upload the file." },
        { status: 400 }
      );
    }

    // Generate unique file name
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${sanitizedFileName}`;
    const filePath = `apps/${appId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("app-files")
      .upload(filePath, file, {
        contentType: file.type || `application/${fileExtension}`,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("app-files")
      .getPublicUrl(filePath);

    // Update the app record with file information
    const { error: updateError } = await supabase
      .from("apps")
      .update({
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        file_type: fileExtension as "apk" | "ipa",
        download_link: urlData.publicUrl,
      })
      .eq("id", appId);

    if (updateError) {
      // If update fails, delete the uploaded file
      await supabase.storage.from("app-files").remove([filePath]);
      return NextResponse.json(
        { error: `Failed to update app: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      filePath,
      fileName: file.name,
      fileSize: file.size,
      fileType: fileExtension,
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

