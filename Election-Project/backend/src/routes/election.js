import { createElection, findByYear, findElectionById, listAllElections, updateElection, deleteElection } from "../services/election.js";
import { authMiddleware, authorizeRole } from "../middlewares/authMiddleware.js";
import CustomError from "../services/customError.service.js";

export function electionRoutes(app){
    app.post('/api/elections/', authMiddleware, authorizeRole(['Officer']), async (req, res) => {
        try {
            const election = await createElection(req.body)
            return res.json(election)
        } catch (error) {
            console.error('error creating election', error)
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

    app.patch('/api/elections/:id', authMiddleware, async (req, res) => {
        const {id} = req.params
        try {
            const updatedElection = await updateElection(id, req.body)
            if(!updatedElection) return res.status(404).end()
            return res.json(updatedElection)
        } catch (error) {
            console.error('error updating election', error)
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

    app.get('/api/elections/year/:year', authMiddleware, async (req, res) => {
        const {year} = req.params
        try {
            const election = await findByYear(year)
            if(!election) res.status(404).end()
            return res.json(election)
        } catch (error) {
            console.error('error getting election by year', error)
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

    app.get('/api/elections/:id', authMiddleware, async (req, res) => {
        const {id} = req.params
        try {
            const election = await findElectionById(id)
            if(!election) return res.status(404).end()
            return res.json(election)
        } catch (error) {
            console.log('error getting election by id', error)
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

    app.get('/api/elections', /*authMiddleware,*/ async (req, res) => {
        try {
            const elections = await listAllElections();
            return res.json(elections);
        } catch (error) {
            console.log('Error getting elections', error)
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

    app.delete('/api/elections/:id', /*authMiddleware, authorizeRole(['Officer']),*/ async (req, res) => {
        const {id} = req.params
        try {
            const {deletedCount} = await deleteElection(id)
            if(deletedCount === 0) return res.status(404).end()
            res.status(204).end()
        } catch (error) {
           console.error('error deleting election', error)
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
}