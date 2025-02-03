import { Candidate } from "../db/models/candidate.js";
import { Student } from "../db/models/student.js"
import { ElectoralOfficer } from "../db/models/electoralOfficer.js";
import {Election} from "../db/models/election.js"
import { Position, Party, ElectionType } from "./enum.js";
import { userService } from "./user.js";
import CustomError, {ErrorCodes} from "./customError.service.js";

// Create Candidate with Validation
export async function createCandidate({ party, position, candidateInfo, votes = 0 }) {
    await validateCandidateInfo({ party, position, candidateInfo }); 
    await canBeCandidate(candidateInfo)
    //Check if there an active election
    const election = await Election.findOne({isActive: true})
    if(!election || !election.isActive) throw new CustomError("Nomination rejected, no upcoming election!", ErrorCodes.NO_ACTIVE_ELECTION, 400)

    const candidate = new Candidate({ party, electionId: election._id, position, candidateInfo, votes });
    return await candidate.save();
}

// Helper Method for Validation
async function validateCandidateInfo(candidate) {
    // Check if candidateInfo corresponds to a valid student
    const studentId = candidate.candidateInfo._id || candidate.candidateInfo
    const student = await Student.findById(studentId);
    
    if (!student) {
        throw new CustomError("Candidate must be a valid existing student!", ErrorCodes.NOT_FOUND, 404);
    }

    // Validate enums
    if (!Object.values(Position).includes(candidate.position)) {
        throw new Error("Invalid position.");
    }
    if (!Object.values(Party).includes(candidate.party)) {
        throw new Error("Invalid party.");
    }

    // Make sure two people cannot be in the same party and also contesting for the same position
    let candidates = await listAllCandidates();
    candidates = candidates.filter(eCandidate => eCandidate.electionId===candidate.electionId);
    const duplicatePartyPosition = candidates.filter(existingCandidate => existingCandidate.party===candidate.party && existingCandidate.position===candidate.position);
    if(duplicatePartyPosition.length>0) throw new CustomError('There is a candidate from this party contesting for the same position!', ErrorCodes.DUPLICATE_PARTY_POSITION_CANDIDATE, 400)
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
    console.log(candidateId);
    return await Candidate.findById(candidateId)
}

export async function updateCandidate(candidateId, {party, position, isApproved}){
    // Validate enums
    if (position && !Object.values(Position).includes(position)) {
        throw new Error("Invalid position.");
    }
    if (party && !Object.values(Party).includes(party)) {
        throw new Error("Invalid party.");
    }
    
    return await Candidate.findOneAndUpdate(
        { _id: candidateId},
        {$set: {party, isApproved, position}},
        {new: true}, // this flag to return the new object instead of the old one
    )
    
}

export async function deleteCandidate(candidateId){
    const user = await userService.getUserByReferenceId(candidateId)
    if(user) await userService.deleteUser(user._id)
    return await Candidate.deleteOne({_id: candidateId})
}


// A validation function to make sure a electoral officer cannot be a candidate
async function canBeCandidate(candidateInfo) {
    
    const isOfficer = await ElectoralOfficer.exists({ officerInfo: candidateInfo });

    if (isOfficer) {
        throw new CustomError("This student is already an officer and cannot be a candidate.", ErrorCodes.CANDIDATE_OFFICER_CONFLICT, 400);
    }
    return true;
}
