import { Schema, model } from 'mongoose';

const settingSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const Setting = model('Setting', settingSchema);

export default Setting;
