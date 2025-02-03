import mongoose, { Schema } from 'mongoose';
import { Student } from './student.js'

const candidateSchema = new Schema(
    {
        party: {
            type: String,
            enum: ['Alliance Party', 'Solutionist Party', 'Independent'], // Define political parties
            required: true,
        },
        electionId: {type: Schema.Types.ObjectId, ref: 'election', required: true,},
        candidateInfo: { type: Schema.Types.ObjectId, ref: 'student', required: true, unique: true, }, // Reference the Student model
        position: {
            type: String,
            enum: ['president', 'secretary', 'treasurer', 'chairman_IEC'], // positions for now
            required: true,
        },
        votes: { type: Number, default: 0 },
        isApproved: {type: Boolean, default: false},
    },
    { timestamps: true }
);

candidateSchema.pre('find', function () {
    this.populate('candidateInfo');
});

candidateSchema.pre('findOne', function () {
    this.populate('candidateInfo');
});


export const Candidate = mongoose.model('Candidate', candidateSchema);
