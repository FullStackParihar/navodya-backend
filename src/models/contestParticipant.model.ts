import mongoose, { Schema, Document } from 'mongoose';

export interface IContestParticipant extends Document {
  contest_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contestParticipantSchema = new Schema({
  contest_id: {
    type: Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only participate once per contest
contestParticipantSchema.index({ contest_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model<IContestParticipant>('ContestParticipant', contestParticipantSchema);
