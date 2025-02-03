import { createCandidate, findCandidateById, findCandidatesByPosition, listAllCandidates, updateCandidate, deleteCandidate } from "../services/candidate.js";
import { authMiddleware, authorizeRole  } from "../middlewares/authMiddleware.js";
import { Candidate } from "../db/models/candidate.js";
import CustomError from "../services/customError.service.js";

export function candidateRoutes(app){
    app.get('/api/candidates'/*, authMiddleware*/, async (req, res) => {
        try{
            const candidates = await listAllCandidates()
            res.json(candidates)
        }catch(error){
            console.error('error listing all candidates', error)
            if(error instanceof CustomError){
                return res.status(error.statuscodeNumber).json({
                    status: 'error',
                    message: error.message,
                    code: error.errorCode,
                    isCustomError: error.isCustomError
                })
            }

            return res.status(500).end()
        }
    })
    app.get('/api/candidates/election/:electionId', authMiddleware, async (req, res) => {
        const {electionId} = req.params
        try {
            const candidates = await Candidate.find({electionId})
            res.json(candidates)
        } catch (error) {
            console.error('error finding candidates by election', error)
            if(error instanceof CustomError){
                return res.status(error.statuscodeNumber).json({
                    status: 'error',
                    message: error.message,
                    code: error.errorCode,
                    isCustomError: error.isCustomError
                })
            }

            res.status(500).end()
        }
    })
    app.get('/api/candidates/:id', authMiddleware, async (req, res) => {
        const {id} = req.params
        try {
            const candidate = await findCandidateById(id)
            if(!candidate) return res.status(404).end()
            return res.json(candidate)
        } catch (error) {
            console.error('error finding candidate by id', error)
            if(error instanceof CustomError){
                return res.status(error.statuscodeNumber).json({
                    status: 'error',
                    message: error.message,
                    code: error.errorCode,
                    isCustomError: error.isCustomError
                })
            }

            res.status(500).end()
        }
    })

    app.get('/api/candidates/fetch/:position', async (req, res) => {
        const {position} = req.params
        try {
            const candidates = await findCandidatesByPosition(position)
            return res.json(candidates)
        } catch (error) {
            console.error('error fetching candidates by position', error)
            if(error instanceof CustomError){
                return res.status(error.statuscodeNumber).json({
                    status: 'error',
                    message: error.message,
                    code: error.errorCode,
                    isCustomError: error.isCustomError
                })
            }
            return res.status(500).end()
        }
    })

    app.post('/api/candidates', authMiddleware, authorizeRole(['Voter']), async (req, res) => {
        try {
            const candidate = await createCandidate(req.body)
            return res.json(candidate)
        } catch (error) {
            console.error('error creating candidate', error)
            if(error instanceof CustomError){
                return res.status(error.statuscodeNumber).json({
                    status: 'error',
                    message: error.message,
                    code: error.errorCode,
                    isCustomError: error.isCustomError
                })
            }

            return res.status(500).end()
        }

    })

    app.patch('/api/candidates/:id', authMiddleware, authorizeRole(['Candidate', 'Officer']), async (req, res) => {
        const {id} = req.params
        try {
            const candidate = await updateCandidate(id, req.body)
            if(!candidate) return res.status(404).end()
            return res.json(candidate)
        } catch (error) {
            console.error('error updating the candidate', error)
            if(error instanceof CustomError){
                return res.status(error.statuscodeNumber).json({
                    status: 'error',
                    message: error.message,
                    code: error.errorCode,
                    isCustomError: error.isCustomError
                })
            }

            res.status(500).end()
        }
    })

    app.delete('/api/candidates/:id', authMiddleware, authorizeRole(['Candidate', 'Officer']), async (req, res) => {
        const {id} = req.params
        try{
            const {deletedCount} = await deleteCandidate(id)
            if(deletedCount === 0) return res.status(404).end()
            return res.status(204).end()
        }catch(error){
            console.error('error deleting candidate', error)
            if(error instanceof CustomError){
                return res.status(error.statuscodeNumber).json({
                    status: 'error',
                    message: error.message,
                    code: error.errorCode,
                    isCustomError: error.isCustomError
                })
            }

            return res.status(500).end()
        }
    })
}