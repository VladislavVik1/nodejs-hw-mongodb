// src/middlewares/uploadPhoto.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1) multer — храним в памяти
const storage = multer.memoryStorage();

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const type = file?.mimetype || "";
    if (!type.startsWith("image/") || (ALLOWED_MIME.size && !ALLOWED_MIME.has(type))) {
      return cb(new Error("Only image files (jpeg, png, webp, gif, heic) are allowed"), false);
    }
    cb(null, true);
  },
}).single("photo");

// 2) Если файл есть — грузим буфер в Cloudinary и кладём URL/public_id в req.body
export const uploadToCloudinary = async (req, res, next) => {
  try {
    // Без файла — пропускаем дальше (POST/PACTH без фото должны работать)
    if (!req.file?.buffer) return next();

    // на всякий случай гарантируем объект
    if (!req.body) req.body = {};

    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "contacts",
            resource_type: "image",
            // можно включить автоформатирование и сжатие, если хотите:
            // transformation: [{ fetch_format: "auto", quality: "auto" }],
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

    const result = await uploadFromBuffer(req.file.buffer);

    req.body.photo = result.secure_url;
    req.body.photoPublicId = result.public_id;

    next();
  } catch (err) {
    next(err);
  }
};
