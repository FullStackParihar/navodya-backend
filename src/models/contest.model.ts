import mongoose, { Schema, Document } from 'mongoose';

export interface IContest extends Document {
  title: string;
  description: string;
  rules: string;
  startDate: Date;
  endDate: Date;
  bannerImage: string;
  googleFormLink?: string;
  isActive: boolean;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contestSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  rules: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  bannerImage: {
    type: String,
    default: ''
  },
  googleFormLink: {
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

export default mongoose.model<IContest>('Contest', contestSchema);
