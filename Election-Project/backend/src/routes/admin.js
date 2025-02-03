import { authMiddleware, authorizeRole } from "../middlewares/authMiddleware.js"
import { createAdmin, updateAdmin, findAdminById, listAllAdmins, deleteAdmin } from "../services/admin.js"
import CustomError from "../services/customError.service.js"

export function adminRoutes(app){
    app.post('/api/admins', authMiddleware, authorizeRole(['Admin']), async (req, res) => {
        try {
            const newAdmin = await createAdmin(req.body)
            if(newAdmin) res.json(newAdmin)
        } catch (error) {
            console.error('Error creating admin:', error)

            // Check if the error is a custom error
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

    app.get('/api/admins', /*authMiddleware, authorizeRole(['Admin']),*/ async (req, res) => {
        try {
            const admins = await listAllAdmins()
            res.json(admins)
        } catch (error) {
            console.error('Error getting admins:', error)
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

    app.get('/api/admins/:id', authMiddleware, authorizeRole(['Admin']), async (req, res) => {
        const {id} = req.params;
        try {
            const admin = await findAdminById(id);
            if(!admin) res.status(404).end()
            res.json(admin)
        } catch (error) {
            console.error('Error getting admin by id:', error)
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

    app.patch('/api/admins/:id', authMiddleware, authorizeRole(['Admin']), async (req, res) => {
        const {id} = req.params
        try {
            const updatedAdmin = await updateAdmin(id, req.body);
            if(updatedAdmin) res.status(200).end()
        } catch (error) {
           console.error('Error updating admin:', error)
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

    app.delete('/api/admins/:id', authMiddleware, authorizeRole(['Admin']), async (req, res) => {
        const {id} = req.params
        try {
            const {deletedCount} = await deleteAdmin(id);
            
            if(deletedCount>0) {
                return res.status(204).json({message: "successful deletion"})
            }
            
        } catch (error) {
            console.error('Error deleting admin: ', error)
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