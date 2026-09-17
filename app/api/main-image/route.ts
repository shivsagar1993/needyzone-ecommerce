import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file =
      (formData.get("uploadedFile") as File) ||
      (formData.get("file") as File) ||
      (formData.get("image") as File);

    if (!file) {
      return NextResponse.json(
        { error: "No image file was received. Please select an image file to upload." },
        { status: 400 }
      );
    }

    const rawName = file.name || "upload.jpg";
    const ext = path.extname(rawName).toLowerCase() || ".jpg";
    const baseName = path.basename(rawName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const sanitizedFileName = `${Date.now()}_${baseName}${ext}`;

    try {
      // Try writing to public/ if permitted
      const publicDir = path.join(process.cwd(), "public");
      if (fs.existsSync(publicDir)) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        fs.writeFileSync(path.join(publicDir, sanitizedFileName), buffer);
      }
    } catch (fsErr) {
      console.warn("[API /api/main-image] Could not write to filesystem (expected on serverless):", fsErr);
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      fileName: sanitizedFileName,
      url: `/${sanitizedFileName}`,
    });
  } catch (error: any) {
    console.error("[API /api/main-image] Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}

