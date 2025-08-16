// src/middlewares/uploadPhoto.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1) multer в память
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

// 2) если файл есть — грузим буфер в Cloudinary и кладём URL в req.body
export const uploadToCloudinary = async (req, res, next) => {
  try {
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

    req.body.photo = result.secure_url;
    req.body.photoPublicId = result.public_id;

    next();
  } catch (err) {
    next(err);
  }
};
