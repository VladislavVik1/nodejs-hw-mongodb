// src/helpers/uploadToCloudinary.js
import { v2 as cloudinary } from "cloudinary";

// Конфигурация из ENV (повторная config безопасна)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Загружает Buffer в Cloudinary и возвращает объект результата
 * @param {Buffer} buffer - содержимое файла
 * @param {Object} opts
 * @param {string} [opts.folder="contacts"] - папка в Cloudinary
 * @param {string} [opts.resource_type="image"] - тип ресурса
 * @returns {Promise<import("cloudinary").UploadApiResponse>}
 */
export function uploadBufferToCloudinary(
  buffer,
  { folder = "contacts", resource_type = "image", ...rest } = {}
) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type, ...rest },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

/**
 * Удаляет ресурс по public_id (опционально для очистки старых фото)
 * @param {string} publicId
 * @returns {Promise<import("cloudinary").DeletionApiResponse>}
 */
export function deleteFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

export default { uploadBufferToCloudinary, deleteFromCloudinary };
