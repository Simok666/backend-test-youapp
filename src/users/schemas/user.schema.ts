import { Schema, Document, model } from 'mongoose';

export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    image: { type: String, default: '' },
    name: { type: String, default: '' },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    birthday: { type: Date },
    horoscope: { type: String, default: '' },
    zodiac: { type: String, default: '' },
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
  },
});

export interface User extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  profile: {
    image: string;
    name: string;
    gender: string;
    birthday: Date;
    horoscope: string;
    zodiac: string;
    height: number;
    weight: number;
  };
}

export const UserModel = model<User>('User', UserSchema);
