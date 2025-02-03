import {Election} from '../db/models/election.js';
import {Candidate} from '../db/models/candidate.js';
import {Vote} from '../db/models/vote.js';
import { findTheLatestElection } from './election.js';
import { updateCandidate } from './candidate.js';
import CustomError, {ErrorCodes} from './customError.service.js';

export async function castVote(voterId, candidateId, electionId, position) {
    const election = await Election.findById(electionId);
    if (!election) throw new CustomError('Election not found!', ErrorCodes.NOT_FOUND, 404);

    // Check if election is ongoing
    const currentTime = Date.now();
    if (currentTime > election.startDate + election.duration) {
        throw new CustomError('Election has ended!', ErrorCodes.ELECTION_TIMEOUT, 400);
    }

    // Make sure no one votes before the election start time/date
    if(currentTime < election.startDate) throw new CustomError('Election has not started yet!', ErrorCodes.ELECTION_TIME_NOT_MET, 400)

    const existingVote = await Vote.findOne({ voterId, electionId, position });
    if (existingVote) throw new CustomError('You have already voted for this position!', ErrorCodes.POSITION_VOTE_DUPLICATION, 400);

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) throw new CustomError('The candidate you are voting for is not found!', ErrorCodes.NOT_FOUND, 404);

    // Increment candidate votes
    const votes = candidate.votes += 1;
    await Candidate.findOneAndUpdate(
        {_id: candidateId},
        {$set: {votes,}},
        {new: true}
    )
    await candidate.save();

    // Record the vote
    const vote = new Vote({ voterId, candidateId, electionId, position });
    await vote.save();
}


// function to get all the vote objects for the active election
export async function getVotes(){
    const activeElection = await findTheLatestElection();
    return await Vote.find({electionId: activeElection._id})
}

