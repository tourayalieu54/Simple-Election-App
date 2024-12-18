import { Election } from '../db/models/election'

export async function findElectionById(electionId){
    return await Election.findById(electionId)
    .populate([
        {path: 'president'},
        {path: 'treasurer'},
        {path: 'secretary'},
        {path: 'chairmanIec'},
        {path: 'coordinatorIec'},
    ]);
}

export async function findByYear(electionYear) {
    return await Election.findOne({
        $expr: { $eq: [{ $year: '$createdAt' }, electionYear] }, //the $expr allows us to use aggregation in queries
    }).populate([
        {path: 'president'},
        {path: 'treasurer'},
        {path: 'secretary'},
        {path: 'chairmanIec'},
        {path: 'coordinatorIec'},
    ]);
}

export async function createElection({duration, president, treasurer, secretary, chairmanIec, coordinatorIec}){
    isTheDurationValid(duration)
    const election = new Election({duration, president, treasurer, secretary, chairmanIec, coordinatorIec})
    return await election.save()
}

export async function updateElection(electionId, {duration}){
    isTheDurationValid(duration)
    return await Election.findByIdAndUpdate(
        {_id: electionId},
        {$set: {duration, createdAt}},
        {new: true},
    )
}

export async function deleteElection(electionId){
    return await Election.findByIdAndDelete({_id: electionId})
}

function isTheDurationValid(time){
    if(time < 0 || time > 24){
        throw new Error('Duration should be between 0 and 24 in hours')
    }
    return true;
}
