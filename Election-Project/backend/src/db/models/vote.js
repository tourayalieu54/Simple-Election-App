import mongoose, { Schema } from 'mongoose';


const voteSchema = new mongoose.Schema({
  voterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  position: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});


// Adding constraints to avoid duplications
voteSchema.index({ voterId: 1, electionId: 1, position: 1 }, { unique: true });

export const Vote = mongoose.model('Vote', voteSchema);
