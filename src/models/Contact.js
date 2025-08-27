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

    // Фото з Cloudinary (зберігаємо лише URL)
    photo: { type: String, default: null },

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

// індекс для швидкого пошуку контактів користувача за ім'ям
contactSchema.index({ userId: 1, name: 1 });

export const Contact = mongoose.model('Contact', contactSchema);
