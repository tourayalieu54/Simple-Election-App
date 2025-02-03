import { Election } from '../db/models/election.js'
import { Candidate } from '../db/models/candidate.js';
import { findCandidatesByPosition, listAllCandidates, deleteCandidate } from './candidate.js';
import { ElectoralOfficer } from '../db/models/electoralOfficer.js';
import { deleteOfficer } from './electoralOfficer.js';
import CustomError, { ErrorCodes } from './customError.service.js';

export async function findElectionById(electionId){
    return await Election.findById(electionId)
    .populate([
        {path: 'president'},
        {path: 'treasurer'},
        {path: 'secretary'},
        {path: 'chairman_IEC'},
    ]);
}

export async function findTheLatestElection(){
    return await Election.findOne({}).sort({ createdAt: -1 }); 
}

export async function listAllElections(){
    return await Election.find({}).populate([
        {path: 'president'},
        {path: 'treasurer'},
        {path: 'secretary'},
        {path: 'chairman_IEC'},
    ])
}

export async function findByYear(electionYear) {
    return await Election.findOne({
        $expr: { $eq: [{ $year: '$createdAt' }, electionYear] }, //the $expr allows us to use aggregation in queries
    }).populate([
        {path: 'president'},
        {path: 'treasurer'},
        {path: 'secretary'},
        {path: 'chairman_IEC'},
    ]);
}

export async function findActiveElection(){
    return await Election.findOne({isActive: true})
    .populate([
        {path: 'president'},
        {path: 'treasurer'},
        {path: 'secretary'},
        {path: 'chairman_IEC'},
    ])
}

export async function createElection({duration, startDate, president, treasurer, secretary, isActive, chairmanIEC}){
    await thereIsActiveElection()
    isTheDurationValid(duration)
    const election = new Election({duration, startDate, president, treasurer, secretary, isActive, chairmanIEC})
    return await election.save()
}
//making sure there is no active election before creating another one
async function thereIsActiveElection(){
    const elections = await Election.find({})
    const activeElections = elections.filter(election => election.isActive===true).length

    if(activeElections>0) throw new CustomError('There is an existing active election', ErrorCodes.ONGOING_ELECTION, 400)
}

export async function updateElection(electionId, {duration, startDate, isActive}){
    isTheDurationValid(duration)
    return await Election.findByIdAndUpdate(
        {_id: electionId},
        {$set: {duration, startDate, isActive}},
        {new: true},
    )
}

export async function deleteElection(electionId){
    const candidatesInThisElection = await Candidate.find({electionId: electionId})
    //delete them
    for(let candidate of candidatesInThisElection){
        await deleteCandidate({_id: candidate._id})
    }
    return await Election.findByIdAndDelete({_id: electionId})
}

function isTheDurationValid(time){
    if(time < 0 || time > 24){
        throw new CustomError('Duration should be between 0 and 24 in hours!', ErrorCodes.OUT_OF_RANGE, 400)
    }
    return true;
}
//Deactivates the election by setting its isActive field to false and then determining the winners of the positions
async function monitorElections() {
    // Fetch the active election (there should only be one)
    const election = await Election.findOne({ isActive: true });
    const now = new Date();

    if (election) {
        // The duration field's type is just a number in the schema, so explicitly converting the duration to milliseconds would be crucial
        const endTime = new Date(election.startDate.getTime() + election.duration * 3600000);

        // Check if current time has surpassed the end time
        if (now >= endTime) {
            // Mark election as inactive
            await Election.updateOne({ _id: election._id }, { isActive: false });
            console.log(`Election has been marked as inactive.`);

            // Fetch candidates for all positions (for this particular election)
            const candidates = await Candidate.find({electionId: election._id}); 

            // Initialize an object to hold winners
            const winners = {
                president: null,
                treasurer: null,
                secretary: null,
                chairman_IEC: null,
            };

            // Determine winners for each position based on votes
            candidates.forEach(candidate => {
                if (!winners[candidate.position] || candidate.votes > winners[candidate.position].votes) {
                    winners[candidate.position] = candidate; // Update winner if this candidate has more votes
                }
            });

            // Updating the election document with winners
            await Election.updateOne(
                { _id: election._id },
                {
                    president: winners.president ? winners.president._id : null,
                    treasurer: winners.treasurer ? winners.treasurer._id : null,
                    secretary: winners.secretary ? winners.secretary._id : null,
                    chairman_IEC: winners.chairman_IEC ? winners.chairman_IEC._id : null,
                }
            );
            console.log('Election document updated with winners.');

            // Getting rid of the existing electoral officer after we have a winner for IEC chairman positiion
            const existingOfficer = await ElectoralOfficer.findOne({});
            if (existingOfficer && winners.chairman_IEC!==null) {
                // Delete existing electoral officer
                await ElectoralOfficer.findByIdAndDelete({_id: existingOfficer._id});
                console.log(`Deleted existing electoral officer with ID ${existingOfficer._id}`);
            }

            // Create new electoral officer for chairmanIEC position if there is a winner
            if (winners.chairman_IEC) {
                const newOfficer = new ElectoralOfficer({
                    officerInfo: winners.chairman_IEC.candidateInfo,
                    position: "chairman_IEC"
                });
                await newOfficer.save();
                console.log(`New electoral officer created for chairmanIEC: ${winners.chairman_IEC.candidateInfo.firstName && ' ' && winners.chairman_IEC.candidateInfo.lastName}`);
            }
        }
    } else {
        console.log("No active elections found.");
    }
}

// Set an interval to check every minute (60000 milliseconds)
setInterval(monitorElections, 60000);
