import express from 'express'
import { studentRoutes } from './routes/student.js'
import { candidateRoutes } from './routes/candidate.js';
import { electoralOfficerRoutes } from './routes/electoralOfficer.js';
import { voteRoutes } from './routes/vote.js';

//create an express app
const app = express()

// adding the middleware to parse request bodies
// here we are using express.json() intead of bodyparser
// because from my research bodyParser is now deprecated
// and express.json which inbuilt in express is the recommended function now.
app.use(express.json());
studentRoutes(app)
candidateRoutes(app)
electoralOfficerRoutes(app)
voteRoutes(app)

// defining routes, sample:
app.get('/', (req, res) => {
    res.send('Hello from Alieu\'s express app :)')
})

// export so it could be used in other files
export default app