import mongoose, { Schema } from 'mongoose';

const electionSchema = new Schema(
    {
    startDate: {type: Date, required: true},
    isActive: {type: Boolean, default: true},
    duration: {type: Number, required: true},
    president: {type: Schema.Types.ObjectId, ref: 'Candidate', default: null},
    treasurer: {type: Schema.Types.ObjectId, ref: 'Candidate', default: null},
    secretary: {type: Schema.Types.ObjectId, ref: 'Candidate', default: null},
    chairman_IEC: {type: Schema.Types.ObjectId, ref: 'Candidate', default: null},
    }, {timestamps: true}
);

export const Election = mongoose.model('Election', electionSchema);
