// src/middlewares/uploadPhoto.js
import multer from "multer";
import createHttpError from "http-errors";
import { cloudinary } from "../libs/cloudinary.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype?.startsWith("image/")) {
      return cb(createHttpError(400, "Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

export const uploadPhoto = upload.single("photo");

export const uploadToCloudinary = (req, res, next) => {
  if (!req.file?.buffer) return next();

  const folder = process.env.CLOUDINARY_FOLDER || "contacts";

  const stream = cloudinary.uploader.upload_stream(
    { folder, resource_type: "image" },
    (err, result) => {
      if (err) return next(createHttpError(400, "Failed to upload image"));
      // положим в body, чтобы прошло валидацию и сохранилось моделью
      req.body.photo = result.secure_url;
      req.body.photoPublicId = result.public_id; // опционально
      next();
    }
  );

  stream.end(req.file.buffer);
};
