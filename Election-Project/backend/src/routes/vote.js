import { castVote, getVotes } from "../services/vote.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import CustomError from "../services/customError.service.js";

export function voteRoutes(app){
    app.post('/api/candidates/votes', authMiddleware, async (req, res) => {
        console.log('Request body: ', req.body)
        const { voterId, candidateId, electionId, position } = req.body;
        console.log(voterId, candidateId, electionId, position)
        try {
            const vote = await castVote(voterId, candidateId, electionId, position);
            if(vote) return res.status(200).json({ message: 'Vote cast successfully!' });
        } catch (error) {
            
            if(error instanceof CustomError){
                return res.status(error.statuscodeNumber).json({
                    status: 'error',
                    message: error.message,
                    code: error.errorCode,
                    isCustomError: error.isCustomError
                })
            }else{
                console.error('Error casting vote:', error);
            }
            

            return res.status(500).end();
        }
    })

    app.get('/api/votes', authMiddleware, async (req, res) => {
        try {
            const votes = await getVotes();
            res.json(votes)
        } catch (error) {
            console.error('Error fetching votes:', error)
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