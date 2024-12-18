import mongoose, { Schema } from 'mongoose';

const electionSchema = new Schema(
    {
    duration: {type: Number, required: true},
    president: {type: Schema.Types.ObjectId, ref: 'candidate', default: null},
    treasurer: {type: Schema.Types.ObjectId, ref: 'candidate', default: null},
    secretary: {type: Schema.Types.ObjectId, ref: 'candidate', default: null},
    chairmanIec: {type: Schema.Types.ObjectId, ref: 'candidate', default: null},
    coordinatorIec: {type: Schema.Types.ObjectId, ref: 'candidate', default: null},
    }, {timestamps: true}
);

export const Election = mongoose.model('Election', electionSchema);
