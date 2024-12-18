import { Candidate } from "../db/models/candidate.js";
import { Student } from "../db/models/student.js"
import { ElectoralOfficer } from "../db/models/electoralOfficer.js";
import { Position, Party, ElectionType } from "./enum.js";

// Create Candidate with Validation
export async function createCandidate({ party, electionType, position, candidateInfo, votes = 0 }) {
    await validateCandidateInfo({ party, electionType, position, candidateInfo }); // Perform validation logic
    await canBeCandidate(candidateInfo)
    const candidate = new Candidate({ party, electionType, position, candidateInfo, votes });
    return await candidate.save();
}

// Helper Method for Validation
async function validateCandidateInfo(candidate) {
    // Check if candidateInfo corresponds to a valid student
    const studentId = candidate.candidateInfo._id || candidate.candidateInfo
    const student = await Student.findById(studentId);
    if (!student) {
        throw new Error("Candidate must be a valid student.");
    }


    // Validate enums (if required)
    if (!Object.values(Position).includes(candidate.position)) {
        throw new Error("Invalid position.");
    }
    if (!Object.values(Party).includes(candidate.party)) {
        throw new Error("Invalid party.");
    }
    if (!Object.values(ElectionType).includes(candidate.electionType)) {
        throw new Error("Invalid election type.");
    }
}



async function listCandidates(
    query = {},
    {sortBy = 'createdAt', sortOrder = 'descending'} = {},
){
    return await Candidate.find(query).sort({ [sortBy] : sortOrder }) //General Syntax of the sort method: sort(field : order(ascending or descending))
    // The sortBy variable should be in the [], orderwise will be termed as the value and therefore would look like this: sort({sortBy : descending})
    // when it actually should be sort({createdAt: ascending}) (according to chatgpt)
}

// Return all candiates
export async function listAllCandidates(options){
    return await listCandidates({}, options)
}


export async function findCandidatesByPosition(position){
    return listCandidates({position})
}

export async function findCandidateById(candidateId){
    return await Candidate.findById(candidateId)
}

export async function updateCandidate(candidateId, {party, electionType, position, isApproved}){
    // Validate enums (if required)
    if (!Object.values(Position).includes(position)) {
        throw new Error("Invalid position.");
    }
    if (!Object.values(Party).includes(party)) {
        throw new Error("Invalid party.");
    }
    if (!Object.values(ElectionType).includes(electionType)) {
        throw new Error("Invalid election type.");
    }
    return await Candidate.findOneAndUpdate(
        { _id: candidateId},
        {$set: {party, electionType, position}},
        {new: true}, // add this flag to return the new object instead of the old one
    )
    
}

export async function deleteCandidate(candidateId){
    return await Candidate.deleteOne({_id: candidateId})
}

// A validation function to make sure a electoral officer cannot be a candidate
async function canBeCandidate(candidateInfo) {
    
    const isOfficer = await ElectoralOfficer.exists({ officerInfo: candidateInfo });

    if (isOfficer) {
        throw new Error("This student is already an officer and cannot be a candidate.");
    }
    return true;
}
