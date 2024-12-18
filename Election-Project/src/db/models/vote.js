import mongoose, {Schema} from 'mongoose';

const voteSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    position: { type: String }, // This can be a reference to a Position model or enum
    electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election' },
    timestamp: { type: Date, default: Date.now }
});

voteSchema.index({ studentId: 1, electionId: 1, position: 1 }, { unique: true });

export const Vote = mongoose.model('vote', voteSchema)