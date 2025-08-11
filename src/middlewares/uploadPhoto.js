import multer from 'multer';
import { cloudinary } from '../libs/cloudinary.js';
import createHttpError from 'http-errors';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadPhoto = upload.single('photo');

export const uploadToCloudinary = (req, res, next) => {
  if (!req.file) return next();

  const folder = process.env.CLOUDINARY_FOLDER || 'contacts';

  const stream = cloudinary.uploader.upload_stream(
    { folder, resource_type: 'image' },
    (err, result) => {
      if (err) return next(createHttpError(400, 'Failed to upload image'));
      req.photoUrl = result.secure_url;
      next();
    }
  );

  stream.end(req.file.buffer);
};
