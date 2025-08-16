import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format',
      },
    },
    isFavourite: { type: Boolean, default: false },

    // Фото из Cloudinary
    photo: { type: String, default: null },          // secure_url
    photoPublicId: { type: String, default: null },  // public_id (опционально)

    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Часто удобно быстро искать по имени внутри пользователя
contactSchema.index({ userId: 1, name: 1 });

export const Contact = mongoose.model('Contact', contactSchema);
