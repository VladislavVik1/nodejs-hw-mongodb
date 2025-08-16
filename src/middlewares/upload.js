// src/middlewares/uploadPhoto.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// ✅ Настройка Cloudinary через переменные окружения
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ 1) Миддлвар загрузки файла в память (multer)
const storage = multer.memoryStorage();

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype?.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
}).single("photo");

// ✅ 2) Миддлвар: если файл есть — загрузить buffer в Cloudinary и
// положить URL в req.body.photo (до валидации схемой)
export const uploadToCloudinary = async (req, res, next) => {
  try {
    // Если файл не прислали — пропускаем дальше
    if (!req.file?.buffer) return next();

    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "contacts", resource_type: "image" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

    const result = await uploadFromBuffer(req.file.buffer);

    // Делаем URL доступным для схемы/контроллера
    req.body.photo = result.secure_url;       // основной URL картинки
    req.body.photoPublicId = result.public_id; // опционально: пригодится для удаления старых фото

    return next();
  } catch (err) {
    return next(err);
  }
};

export default { uploadPhoto, uploadToCloudinary };
