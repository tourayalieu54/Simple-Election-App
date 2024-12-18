import {Election} from '../db/models/election.js';
import {Candidate} from '../db/models/candidate.js';
import {Vote} from '../db/models/vote.js';

export async function castVote(studentId, candidateId, electionId, position) {
    const election = await Election.findById(electionId);
    if (!election) throw new Error('Election not found.');

    // Check if election is ongoing
    const currentTime = Date.now();
    if (currentTime > election.createdAt + election.duration) {
        throw new Error('Election has ended.');
    }

    const existingVote = await Vote.findOne({ studentId, electionId, position });
    if (existingVote) throw new Error('Student has already voted for this position.');

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) throw new Error('Candidate not found.');

    // Increment candidate votes
    candidate.votes += 1;
    await candidate.save();

    // Record the vote
    const vote = new Vote({ studentId, candidateId, position, electionId });
    await vote.save();
}

