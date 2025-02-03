import mongoose, { Schema} from "mongoose";


// Creating the schema
const studentSchema = new Schema({
    firstName: {type: String, required: true},
    middleName: String,
    lastName: {type: String, required: true},
    matNumber: {type: String, required: true, unique: true},
    department: {type: String, required: true},
},{timestamps: true})

// Middleware to prevent deletion if referenced
studentSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const studentId = this._id; // `this` refers to the document being deleted
  
    // Check references in ElectoralOfficer and Candidate collections
    const isReferencedInOfficer = await mongoose.model('electoralOfficer').exists({ studentId });
    const isReferencedInCandidate = await mongoose.model('Candidate').exists({ studentId });
  
    if (isReferencedInOfficer || isReferencedInCandidate) {
      return next(new Error('Cannot delete student: Referenced by other documents.'));
    }
  
    next(); // Proceed with deletion if no references are found
  });

//creating the model
export const Student = mongoose.model('student', studentSchema)

