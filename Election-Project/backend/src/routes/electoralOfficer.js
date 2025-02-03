import { authMiddleware, authorizeRole } from '../middlewares/authMiddleware.js'
import { listAllCandidates } from '../services/candidate.js'
import { createOfficer, deleteOfficer, findOfficerById, listAllOfficers, updateOfficer,  } from '../services/electoralOfficer.js'
import CustomError from '../services/customError.service.js'

export function electoralOfficerRoutes(app){
    //Won't be in use as creating officers is handled by app itself after an election
    app.post('/api/electoralOfficer'/*, authMiddleware, authorizeRole(['Officer', 'Admin'])*/, async (req, res) => {
        const electoralOfficer = req.body
        try {
            const officer = await createOfficer(electoralOfficer)
            return res.json(officer)
        } catch (error) {
            console.error('error adding creating an electoral officer', error)
            return res.status(500).end()
        }
    })

    app.get('/api/electoralOfficer/:id', authMiddleware, async (req, res) => {
        const {id} = req.params
        try {
            const officer = await findOfficerById(id)
            if(!officer) return res.status(404).end()
            return res.json(officer)
        } catch (error) {
            console.error('error getting officer by id', error)
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

    app.get('/api/electoralOfficer', /*authMiddleware,*/ async (req, res) =>{
        try {
            const officers = await listAllOfficers()
            return res.json(officers)
        } catch (error) {
            console.error('error fetching electoral officers', error);
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

    app.patch('/api/electoralOfficer/:id', authMiddleware, authorizeRole(['Officer']), async (req, res) => {
        const {id} = req.params
        try {
            const updatedOfficer = await updateOfficer(id, req.body)
            if(!updatedOfficer) return res.status(404).end()
            return res.json(updatedOfficer)
        } catch (error) {
            console.error('error updating officer', error)
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

    app.delete('/api/electoralOfficer/:id'/*, authMiddleware, authorizeRole(['Officer'])*/, async (req, res) => {
        const {id} = req.params
        try {
            const {deletedCount} = await deleteOfficer(id)
            if(deletedCount === 0) return res.status(404).end()
            return res.status(204).end()
        } catch (error) {
            console.error('error deleting electoral officer', error);
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