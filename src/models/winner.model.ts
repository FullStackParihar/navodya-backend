import mongoose, { Schema, Document } from 'mongoose';

export interface IWinner extends Document {
  contest_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  prize: string;
  isPublished: boolean;
  showUserDetails: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const winnerSchema = new Schema({
  contest_id: {
    type: Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prize: {
    type: String,
    required: true,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  showUserDetails: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// A user can only win a specific contest once
winnerSchema.index({ contest_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model<IWinner>('Winner', winnerSchema);
