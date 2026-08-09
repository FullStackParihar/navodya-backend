import mongoose, { Schema, Document } from 'mongoose';

export interface IAlumniMeet extends Document {
  name: string;
  jnv: string;
  batch: string;
  location: string;
  attendees: number;
  image?: string;
  registrationLink?: string;
  isActive: boolean;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const alumniMeetSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  jnv: {
    type: String,
    required: true,
    trim: true
  },
  batch: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  attendees: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  registrationLink: {
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

export default mongoose.model<IAlumniMeet>('AlumniMeet', alumniMeetSchema);
