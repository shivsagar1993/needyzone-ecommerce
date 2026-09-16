const path = require("path");
const fs = require("fs");
const prisma = require("../utills/db"); // ✅ Use shared connection

async function uploadMainImage(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        error: "No image file was received. Please select an image file to upload.",
        message: "No image file provided"
      });
    }

    // Support multiple form field names
    const uploadedFile =
      req.files.uploadedFile ||
      req.files.file ||
      req.files.image ||
      Object.values(req.files)[0];

    if (!uploadedFile) {
      return res.status(400).json({
        error: "Image file data is empty. Please select a valid file.",
        message: "Empty file payload"
      });
    }

    // Supported extensions & MIME types
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
    const ext = path.extname(uploadedFile.name || "").toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({
        error: `Unsupported file extension "${ext || "unknown"}". Allowed image formats are: JPG, JPEG, PNG, WEBP, GIF, SVG.`,
        message: "Invalid file format"
      });
    }

    // Max size: 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (uploadedFile.size > MAX_SIZE) {
      const sizeMB = (uploadedFile.size / (1024 * 1024)).toFixed(2);
      return res.status(400).json({
        error: `File size (${sizeMB} MB) exceeds the maximum limit of 5 MB. Please upload a smaller image.`,
        message: "File too large"
      });
    }

    // Resolve absolute path to public/ in frontend root
    const publicDir = path.resolve(__dirname, "../../public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Sanitize filename to avoid path traversal or invalid characters
    const baseName = path.basename(uploadedFile.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const sanitizedFileName = `${baseName}${ext}`;
    const destinationPath = path.join(publicDir, sanitizedFileName);

    await uploadedFile.mv(destinationPath);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      fileName: sanitizedFileName,
      url: `/${sanitizedFileName}`
    });
  } catch (err) {
    console.error("Error in uploadMainImage:", err);
    return res.status(500).json({
      error: `Server encountered an error while saving the image: ${err.message || err}`,
      message: "Internal image upload failure"
    });
  }
}

module.exports = {
  uploadMainImage
};