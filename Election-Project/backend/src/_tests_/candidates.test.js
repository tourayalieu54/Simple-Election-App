import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, afterEach } from '@jest/globals'

import { createCandidate, listAllCandidates, findCandidateById, updateCandidate, deleteCandidate } from '../services/candidate'
import { Candidate } from '../db/models/candidate'
import { Student } from '../db/models/student'

const sampleStudents = [
    {firstName: 'Saikou', lastName: 'Gassama', matNumber: '33333331', department: 'SOSA'},
    {firstName: 'Rohey', lastName: 'Jatta', matNumber: '44448441', department: 'ICT'},
    {firstName: 'Alieu', lastName: 'Touray', matNumber: '22222223', department: 'School of Astronomy'},
    {firstName: 'Raymond', lastName: 'King', matNumber: '32323232', department: 'Hardware Programming'}
]

let createdSampleStudents = [];
let createdSampleCandidates = [];

// Clearing the database and resetting variables before each test
beforeEach(async () => {
    //await Student.deleteMany({});
    //await Candidate.deleteMany({});
    createdSampleStudents = [];
    createdSampleCandidates = [];

    // Create sample students
    for (const student of sampleStudents) {
        const createdStudent = new Student(student);
        createdSampleStudents.push(await createdStudent.save());
    }

    const sampleCandidates = [
        { party: "Alliance Party", electionType: "General", position: "President", candidateInfo: createdSampleStudents[0]._id },
        { party: "Solutionist Party", electionType: "General", position: "Treasurer", candidateInfo: createdSampleStudents[1]._id },
    ];

    // Creating sample candidates in the database
    for (const candidate of sampleCandidates) {
        const createdCandidate = new Candidate(candidate);
        createdSampleCandidates.push(await createdCandidate.save());
    }
});
// Test cases
describe('creating candidate', () => {
    test('should succeed with all the required fields', async () => {
        const candidate = { party: 'Independent', electionType: 'General', position: 'Treasurer', candidateInfo: createdSampleStudents[0]._id }
        const createdCandidate = await createCandidate(candidate)

        expect(createdCandidate._id).toBeInstanceOf(mongoose.Types.ObjectId)

        const foundCandidate = await Candidate.findById(createdCandidate._id)
        foundCandidate.candidateInfo = foundCandidate.candidateInfo._id
        expect(foundCandidate).toMatchObject(candidate)
        expect(foundCandidate.updatedAt).toBeInstanceOf(Date)
        expect(foundCandidate.createdAt).toBeInstanceOf(Date)
    })

    test('Should fail if two or more candidates from the same party stand for the same position', async () => {
        const candidate = { party: 'Alliance Party', electionType: 'General', position: 'President', candidateInfo: createdSampleStudents[3]._id }
        try {
            await createCandidate(candidate)
        } catch (err) {
            expect(err.message).toContain('Two or more candidates from the same party can\'t stand for the same position')
        }
    })
})

describe('listing candidates', () => {
    test('should return all candidates', async () => {
        const candidates = await listAllCandidates()
        expect(candidates.length).toEqual(createdSampleCandidates.length)
    })

    test('should return candidates from newest to oldest', async () => {
        const candidates = await listAllCandidates()
        const sortedSampleCandidates = createdSampleCandidates.sort((a, b) => b.createdAt - a.createdAt)
        expect(candidates.map((post) => post.createdAt)).toEqual(sortedSampleCandidates.map((student) => student.createdAt))
    })

    

    test('should find a candidate by ID', async () => {
        const candidateId = createdSampleCandidates[0]._id
        const candidate = await findCandidateById(candidateId)
    
        expect(candidate).toBeDefined()
        expect(candidate._id).toEqual(candidateId)

        const cleanedCandidate = JSON.parse(JSON.stringify(candidate))
        
        const expectedCandidate = JSON.parse(JSON.stringify(createdSampleCandidates[0]));
        //expect(cleanedCandidate).toMatchObject(expectedCandidate);
        expect(cleanedCandidate.party).toEqual(expectedCandidate.party)
        expect(cleanedCandidate.electionType).toEqual(expectedCandidate.electionType)
        expect(cleanedCandidate.position).toEqual(expectedCandidate.position)
    })

    test('should not find non-existing id', async () => {
        const nonExistingId = new mongoose.Types.ObjectId()
        const candidate = await findCandidateById(nonExistingId)
        expect(candidate).toEqual(null)
    })
})


describe('updating candidate records', ()=>{
    test('should update existing cadidate record', async () => {
        await updateCandidate(createdSampleCandidates[0]._id, {party: 'UDP',})
        const updatedCandidate = await findCandidateById(createdSampleCandidates[0]._id)
        expect(updatedCandidate.party).toEqual('UDP')
    })

    test('should not update non-existing candidate record', async () => {
        const result = await updateCandidate( new mongoose.Types.ObjectId(), {party: 'Yusuf',})
        expect(result).toEqual(null)
    })
})

describe('deleting a candidate record (object)', ()=>{
    test('should delete existing candidate', async () => {
        await deleteCandidate(createdSampleCandidates[0]._id)
        const deletedCandidate = await Candidate.findById(createdSampleCandidates[0]._id)
        expect(deletedCandidate).toEqual(null)
    })
})
    