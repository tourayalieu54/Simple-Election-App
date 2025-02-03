import mongoose, { Schema } from "mongoose";
import {Student} from './student.js'

const electoralOfficerSchema = new Schema({
    officerInfo: {type: Schema.Types.ObjectId, ref: 'student', required: true, unique: true},
    position: {type: String, required: true, unique: true}
}, {timestamps: true})

electoralOfficerSchema.pre('find', function(){
    this.populate('officerInfo')
})

electoralOfficerSchema.pre('findOne', function (){
    this.populate('officerInfo')
})

export const ElectoralOfficer = mongoose.model('electoralOfficer', electoralOfficerSchema)