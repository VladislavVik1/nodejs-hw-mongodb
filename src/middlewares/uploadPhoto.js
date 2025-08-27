// src/middlewares/uploadPhoto.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer — тримаємо файл у пам'яті
const storage = multer.memoryStorage();

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

const fileFilter = (req, file, cb) => {
  const type = file?.mimetype || "";
  if (!type.startsWith("image/") || (ALLOWED_MIME.size && !ALLOWED_MIME.has(type))) {
    return cb(new Error("Only image files (jpeg, png, webp, gif, heic/heif) are allowed"), false);
  }
  cb(null, true);
};

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
}).single("photo");

// Якщо файл є — вантажимо буфер у Cloudinary і кладемо URL у req.body.photo
export const uploadToCloudinary = async (req, _res, next) => {
  try {
    // Без файлу — пропускаємо далі (POST/PATCH без фото мають працювати)
    if (!req.file?.buffer) return next();

    if (!req.body) req.body = {};

    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "contacts",
            resource_type: "image",
            // за потреби ввімкніть автоматичне стиснення:
            // transformation: [{ fetch_format: "auto", quality: "auto" }],
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

    const result = await uploadFromBuffer(req.file.buffer);

    // Відповідно до критеріїв: зберігаємо лише URL
    req.body.photo = result.secure_url;

    next();
  } catch (err) {
    next(err);
  }
};
