import {userService} from '../services/user.js';
import {authMiddleware, authorizeRole} from  '../middlewares/authMiddleware.js';// Middleware for protecting routes
import { User } from '../db/models/user.js';
import CustomError from '../services/customError.service.js';

export function userRoutes(app){

    // User Signup Route
    app.post('/api/signup', async (req, res) => {
        try {
            const { username, password, role, matNumber, candidateId, staffId } = req.body;
            
            const user = await userService.createUser(username, password, role, matNumber, candidateId, staffId);
            res.status(201).json(user);
        } catch (error) {
            console.error('Error signing up: ', error);
            if(error instanceof CustomError){
                return res.status(error.statuscodeNumber).json({
                    status: 'error',
                    message: error.message,
                    code: error.errorCode,
                    isCustomError: error.isCustomError
                })
            }

            res.status(400).end();
        }
    });

    // Get User Profile (protected route)
    app.get('/api/profile', authMiddleware, async (req, res) => {
        try {
            const userId = req.user.id;
            const userProfile = await userService.getUserById(userId);
            res.status(200).json(userProfile);
        } catch (error) {
            console.error('There is an error fetching user\'s profile:', error)
            if(error instanceof CustomError){
                return res.status(error.statuscodeNumber).json({
                    status: 'error',
                    message: error.message,
                    code: error.errorCode,
                    isCustomError: error.isCustomError
                })
            }

            res.status(500).end();
        }
    });

    app.get('/api/users', authMiddleware, authorizeRole(['Admin']), async (req, res) => {
        try {
            const users = await userService.listAllUsers()
            res.json(users)
        } catch (error) {
            console.error('Error fetching users:', error);
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

    app.get('/api/user/:id', authMiddleware, authorizeRole(['Admin']), async (req, res) => {
        const {id} = req.params;
        try {
            const user = await userService.getUserByReferenceId(id);
            if(!user) res.status(404).json({message: 'Reference ID not found!'})
            res.json(user)
        } catch (error) {
            console.error('Error fetching user by reference id:', error);
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

    app.patch('/api/users/:id', authMiddleware, authorizeRole(['Admin']), async (req, res) => {
        const {id} = req.params;
        try {
            const updatedUser = await userService.updateUser(id, req.body)
            if(updatedUser) res.status(200).end()
        } catch (error) {
            console.error('Error updating user:', error);
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

    app.delete('/api/users/:id', authMiddleware, authorizeRole(['Admin']), async (req, res) => {
        const {id} = req.params
        try {
            const {deletedCount} = await userService.deleteUser(id)
            if(deletedCount>0){ res.status(204).end()}
            else{ res.status(404).end()
            }
        } catch (error) {
            console.error('Error deleting user:', error)
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
