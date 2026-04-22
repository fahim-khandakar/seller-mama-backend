import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      // Clean filename: remove extension, clean special chars, add timestamp
      const nameWithoutExt = file.originalname
        .toLowerCase()
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/\s+/g, "-") // Replace spaces with dash
        .replace(/[^a-z0-9\-]/g, ""); // Remove special chars except dash

      // Get clean extension
      const extension =
        file.originalname.split(".").pop()?.toLowerCase() || "jpg";

      // Create unique filename without double extension
      const uniqueFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${nameWithoutExt}`;

      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage: storage });
