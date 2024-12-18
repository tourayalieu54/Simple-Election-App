import { Student } from "../db/models/student.js";

export async function createStudent({firstName, middleName, lastName, matNumber, department}){
    const student = new Student({firstName, middleName, lastName, matNumber, department})
    return await student.save() // saving to the database
}

// async function listStudents(
//     query = {},
//     {sortBy = 'createdAt', sortOrder = 'descending'} = {},
// ){
//     return await Student.find(query).sort({ [sortBy] : sortOrder }) //General Syntax of the sort method: sort(field : order(ascending or descending))
//     // The sortBy variable should be in the [], orderwise will be termed as the value and therefore would look like this: sort({sortBy : descending})
//     // when it actually should be sort({createdAt: ascending}) (according to chatgpt)
// }

// Return all students
export async function listAllStudents(options){
    return await Student.find()
}

export async function findByMatNumber(matNumber){
    return await Student.findOne({matNumber})
}

export async function findStudentById(studentId){
    return await Student.findById(studentId)
}

export async function updateStudent(studentId, {firstName, middleName, lastName, matNumber, department}){
    return await Student.findOneAndUpdate(
        { _id: studentId},
        {$set: {firstName, middleName, lastName, matNumber, department}}, //change the fields (I don't include the candidateChoice fields here because once a student votes, no should be able to change it, not even that student)
        {new: true}, // add this flag to return the new object instead of the old one
    )
}

export async function deleteStudent(studentId){
    return await Student.deleteOne({_id: studentId})
}

