import mongoose, { Schema, trusted } from "mongoose";


// Creating the schema
const studentSchema = new Schema({
    firstName: {type: String, required: true},
    middleName: String,
    lastName: {type: String, required: true},
    matNumber: {type: String, required: true, unique: true},
    department: {type: String, required: true},
},{timestamps: true})

//creating the model

export const Student = mongoose.model('student', studentSchema)

