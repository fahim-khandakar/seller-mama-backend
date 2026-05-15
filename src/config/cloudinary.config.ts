/* eslint-disable @typescript-eslint/no-explicit-any */

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import stream from "stream";
import { envVars } from "./env";
import AppError from "../error helpers/AppError";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Date.now()}`;

      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id: public_id,
            folder: "pdf",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        )
        .end(buffer);
    });
  } catch (error: any) {
    throw new AppError(401, `Error uploading file ${error.message}`);
  }
};

export const deleteImageFromCLoudinary = async (url: string) => {
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{timestamp}/{public_id}.{extension}

    const urlParts = url.split("/");
    const filePart = urlParts[urlParts.length - 1]; // Gets "public_id.extension"
    const public_id = filePart.split(".")[0]; // Gets public_id without extension

    if (public_id) {
      await cloudinary.uploader.destroy(public_id);
    } else {
      throw new Error("Could not extract public_id from URL");
    }
  } catch (error: any) {
    console.error("Cloudinary deletion error:", error);
    throw new AppError(401, "Cloudinary image deletion failed", error.message);
  }
};

export const cloudinaryUpload = cloudinary;
