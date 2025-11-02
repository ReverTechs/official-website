import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get("appId");

    if (!appId) {
      return NextResponse.json(
        { error: "App ID is required" },
        { status: 400 }
      );
    }

    // Use createClient for public read access
    const supabase = await createClient();

    // Fetch app data
    const { data: app, error: appError } = await supabase
      .from("apps")
      .select("id, title, file_path, file_name, file_type, download_link")
      .eq("id", appId)
      .single();

    if (appError || !app) {
      return NextResponse.json(
        { error: "App not found" },
        { status: 404 }
      );
    }

    // Increment download count (non-blocking, fail silently if it fails)
    try {
      await supabase.rpc('increment_app_downloads', { app_id: appId });
    } catch (error) {
      // Silently fail - don't block download if counter increment fails
      console.log("Could not increment download count:", error);
    }

    // If file_path exists, download from storage
    if (app.file_path && app.file_name) {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("app-files")
        .download(app.file_path);

      if (downloadError || !fileData) {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }

      // Convert blob to buffer
      const arrayBuffer = await fileData.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Determine content type
      const contentType =
        app.file_type === "apk"
          ? "application/vnd.android.package-archive"
          : app.file_type === "ipa"
          ? "application/octet-stream"
          : "application/octet-stream";

      // Set appropriate headers for file download
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${encodeURIComponent(app.file_name)}"`,
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // If no file_path but download_link exists, redirect to external link
    if (app.download_link) {
      return NextResponse.redirect(app.download_link);
    }

    return NextResponse.json(
      { error: "No download available for this app" },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

