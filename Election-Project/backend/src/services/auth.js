import jwt from 'jsonwebtoken';
import {User} from '../db/models/user.js';
import {Candidate} from '../db/models/candidate.js';
import {Student} from '../db/models/student.js';
import {ElectoralOfficer} from '../db/models/electoralOfficer.js';
import { Admin } from '../db/models/admin.js';
import CustomError, { ErrorCodes } from './customError.service.js';



export class AuthService {
    static async login(username, password) {
        const user = await User.findOne({username: username });
        if (!user) throw new CustomError('Username not found!', ErrorCodes.NOT_FOUND, 404);

        // // Hash the password
        // const hashedPassword = bcrypt.hash(10, password)
        const isPasswordValid = await user.isValidPassword(password);
        if (!isPasswordValid) throw new Error('Invalid password');

        
        // Validate the referenceId based on the role
        let referenceModel;
        switch (user.role) {
            case 'Candidate':
                referenceModel = Candidate;
                break;
            case 'Voter':
                referenceModel = Student;
                break;
            case 'Officer':
                referenceModel = ElectoralOfficer;
                break;
            case 'Admin':
                referenceModel = Admin;
                break;
            default:
                throw new CustomError('Invalid role!', ErrorCodes.INVALID_ROLE, 400);
        }

        // const referenceExists = await referenceModel.findById(user.referenceId);
        // if (!referenceExists) throw new CustomError('Invalid reference ID!', ErrorCodes.NOT_FOUND, 404);

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, referenceId: user.referenceId },
            process.env.JWT_SECRET,
            { expiresIn: parseInt(process.env.JWT_EXPIRATION, 10) }
        );

        return { token, role: user.role };
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            throw new Error('Invalid or expired token');
        }
    }
}




