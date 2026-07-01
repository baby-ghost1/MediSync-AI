import { Router } from "express";
import path from "path";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { fileURLToPath } from "url";

import cloudinary from "../config/cloudinary.js";

import {
  auth,
  upload,
} from "../middleware/index.js";

const router = Router();
const uploadDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../uploads"
);

router.post(
  "/",
  auth,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
        });
      }

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const cloudKey = process.env.CLOUDINARY_API_KEY;
      const cloudSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !cloudKey || !cloudSecret) {
        await mkdir(uploadDirectory, { recursive: true });

        const extension = path.extname(req.file.originalname)
          .toLowerCase()
          .replace(/[^.a-z0-9]/g, "");
        const filename = `${randomUUID()}${extension}`;

        await writeFile(
          path.join(uploadDirectory, filename),
          req.file.buffer
        );

        return res.status(201).json({
          success: true,
          data: {
            url: `${req.protocol}://${req.get("host")}/uploads/${filename}`,
            publicId: filename,
          },
        });
      }

      const result =
        await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`,
          {
            folder:
              "medisync-ai",
            resource_type:
              "auto",
          }
        );

      res.status(201).json({
        success: true,
        data: {
          url: result.secure_url,
          publicId:
            result.public_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
