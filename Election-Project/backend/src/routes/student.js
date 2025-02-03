import { authMiddleware, authorizeRole } from "../middlewares/authMiddleware.js";
import { createStudent, listAllStudents, findStudentById, findByMatNumber, updateStudent, deleteStudent } from "../services/student.js";
import CustomError from "../services/customError.service.js";

export function studentRoutes(app){
    app.get('/api/students', /*authMiddleware, authorizeRole(['Officer']),*/ async (req, res) => {
        try{
            const students = await listAllStudents()
            return res.json(students)
        }catch(error){
            console.error('error listing students', error)
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

    app.get('/api/students/:id', authMiddleware, async (req, res) => {
        const {id} = req.params
        try{
            const student = await findStudentById(id)
            if(student === null) return res.status(404).end()
            return res.json(student)
        }catch(error){
            console.error('error getting student', error)
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

    app.get('/api/students/find/:matNumber', authMiddleware, authorizeRole(['Officer']), async (req, res) => {
        const {matNumber} = req.params
        try{
            const student = await findByMatNumber(matNumber)
            if(student === null){
                return res.status(404).end()
            }
            return res.json(student)
        }catch(error){
            console.error('error getting student', error)
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

    app.post('/api/students', authMiddleware, authorizeRole(['Admin']), async (req, res) => {
        try{
            const student = await createStudent(req.body)
            return res.json(student)
        }catch (error){
            console.error('error creating post', error);
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

    app.patch('/api/students/:id', authMiddleware, authorizeRole(['Admin']), async (req, res) => {
        try{
            const updatedStudent = await updateStudent(req.params.id, req.body)
            if(!updatedStudent) {return res.status(404).end()}
            return res.json(updateStudent)
        }catch(error){
            console.error("error updating student", error);
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

    app.delete('/api/students/:id', authMiddleware, authorizeRole(['Admin']), async (req, res) => {
        try{
            const { deletedCount } = await deleteStudent(req.params.id)
            // Trying to destructure the object returned by mongoose/mongodb when we delete a record
            // so we can directly access the deletedCount variable
            if(deletedCount === 0) return res.sendStatus(404)
            return res.status(204).end()
        }catch(error){
            console.error("error deleting student", error);
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