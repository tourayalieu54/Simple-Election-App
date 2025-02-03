import express from 'express'
import { studentRoutes } from './routes/student.js'
import { candidateRoutes } from './routes/candidate.js';
import { electoralOfficerRoutes } from './routes/electoralOfficer.js';
import { voteRoutes } from './routes/vote.js';
import cors from 'cors'
import { authRoutes } from './routes/auth.js';
import { userRoutes } from './routes/user.js';
import { electionRoutes } from './routes/election.js';
import { adminRoutes } from './routes/admin.js';

//create an express app
const app = express()
// allowing cfross origin resource sharing CORS
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET','POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Role'],
    credentials: true // If we need to send cookies or other credentials
  }));
// adding the middleware to parse request bodies
// here we are using express.json() intead of bodyparser
// because from my research bodyParser is now deprecated
// and express.json which inbuilt in express is the recommended function now.
app.use(express.json());
studentRoutes(app)
candidateRoutes(app)
electoralOfficerRoutes(app)
electionRoutes(app)
voteRoutes(app)
authRoutes(app)
userRoutes(app)
adminRoutes(app)

// defining routes, sample:
app.get('/', (req, res) => {
    res.send('Hello from Alieu\'s express app :)')
})

// export so it could be used in other files
export default app