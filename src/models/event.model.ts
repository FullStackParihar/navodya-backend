import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  type: string;
  date: Date;
  time: string;
  platform: string;
  registrationLink?: string;
  image?: string;
  isActive: boolean;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  registrationLink: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IEvent>('Event', eventSchema);
