import {AuthService} from '../services/auth.js'; 
import { User } from '../db/models/user.js';
import CustomError from '../services/customError.service.js';

export function authRoutes(app){
    // User Login Route
    app.post('/api/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            const { token, role } = await AuthService.login(username, password);
            res.status(200).json({ token, role });
        } catch (error) {
            console.error('There is an error authenticating you:', error)
            if(error instanceof CustomError){
                return res.status(error.statuscodeNumber).json({
                    status: 'error',
                    message: error.message,
                    code: error.errorCode,
                    isCustomError: error.isCustomError
                })
            }

            res.status(401).end()
        }
    });

    app.get('/api/users', async (req, res) => {
        try {
            const users = await User.find({})
            res.json(users)
        } catch (error) {
            console.error('error getting users', error)
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
    });

    app.patch('/api/user/:id', async (req, res) => {
        const { id } = req.params;
        const { role } = req.body; // Extract role from the request body
        try {
            const updatedUser = await User.findByIdAndUpdate(
                id, // Pass the ID directly
                { $set: { role } }, // Set the new role
                { new: true } // Return the updated document
            );
            if (!updatedUser) return res.status(404).json({ message: "User not found" });
            res.json(updatedUser);
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

            res.status(500).end();
        }
    });
    
}
