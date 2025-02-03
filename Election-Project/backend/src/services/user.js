import {User} from '../db/models/user.js'
import {findCandidateById} from '../services/candidate.js';
import { listAllOfficers } from '../services/electoralOfficer.js';
import { findByMatNumber, findStudentById } from '../services/student.js';
import { Candidate } from '../db/models/candidate.js';
import { ElectoralOfficer } from '../db/models/electoralOfficer.js';
import { findAdminByStaffId } from './admin.js';
import CustomError, {ErrorCodes} from './customError.service.js';
import bcrypt from 'bcrypt'


export class userService {
    static async createUser(username, password, role, matNumber, candidateId, staffId) {
        let userExists = null;
        
        // Validate user by role and matNumber
        if (role === 'Voter') {
            // Ensure matNumber is provided for student validation
            if (!matNumber) {
                throw new CustomError('matNumber is required to create a user.', ErrorCodes.MISSING_REQUIRED_FIELD, 400);
            }
            // For voters, validate that the user exists as a Student
            const student = await findByMatNumber(matNumber);
            if (!student) {
                throw new CustomError('Student not found with the provided matNumber.', ErrorCodes.NOT_FOUND, 404);
            }

            //make sure a student does not create a student user account when he is a candidate
            const studentIsACandidate = await Candidate.findOne({candidateInfo: student._id})
            if(studentIsACandidate){
                throw new CustomError('Student is a candidate, thus can\'t have a student user account!', ErrorCodes.STUDENT_CANDIDATE_CONFLICT, 400)
            }

            //make sure a student does not create a student user account when he/she is an officer
            const studentIsAnOfficer = await ElectoralOfficer.findOne({officerInfo: student._id})
            if(studentIsAnOfficer) throw new CustomError('Student is an officer, thus cannot have a student user account!', ErrorCodes.STUDENT_OFFICER_CONLFICT, 400)

            //referenceModel = 'Student';  // Reference to the student model
            userExists = student; // Assign the student to userExists
            
        } else if (role === 'Candidate') {
            // For candidates, find the candidate by candidateId
            const candidate = await findCandidateById(candidateId);
            if (!candidate) {
                throw new CustomError('Candidate not found with the provided candidateId!', ErrorCodes.NOT_FOUND, 404);
            }
            // Delete the student user account when creating a candidate user account
            const studentUserAccount = await this.getUserByReferenceId(candidate.candidateInfo);
            await this.deleteUser(studentUserAccount._id);

            //referenceModel = 'Candidate';  // Reference to the candidate model
            userExists = candidate; // Assign the candidate to userExists
        } else if (role === 'Officer') {
            // For electoral officers, find the officer by electoralOfficerId
            const electoralOfficers = await listAllOfficers();
            if (electoralOfficers.length === 0) {
                throw new CustomError('Electoral officer not found!', ErrorCodes.NOT_FOUND, 404);
            }

            // Delete his student user account
            
            const respectiveStudent = await findStudentById(electoralOfficers[0].officerInfo);
            //find the candidate user account
            if(respectiveStudent) {
                const studentUserAccount = await this.getUserByReferenceId(respectiveStudent._id)
                //delete the candidate user account
                if(studentUserAccount){
                    await this.deleteUser(studentUserAccount._id);
                }
            }
            userExists = electoralOfficers[0]; // Assign the electoral officer to userExists
        } else if(role === "Admin"){
            const admin = await findAdminByStaffId(staffId);
            if(!admin) throw new CustomError('Admin not found!', ErrorCodes.NOT_FOUND, 404)
            userExists = admin;
        }else{
            throw new CustomError('Invalid role. Valid roles are: Officer, Candidate and Voter.', ErrorCodes.INVALID_ROLE, 400);
        }

        // Check if the username already exists in the User collection
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new CustomError('A user with this username already exists!', ErrorCodes.USERNAME_EXISTS, 400);
        }

        //Adding another constraint that referenceId(s) can't be duplicated in user accounts
        const existingReferenceIdUser = await this.getUserByReferenceId(userExists._id);
        if(existingReferenceIdUser){
            throw new CustomError('There exist a user with that reference id!', ErrorCodes.DUPLICATE_USER_ID, 400)
        }

        // Create a new user and link to the reference model
        const newUser = new User({
            username,
            password, // Make sure to hash the password before saving
            role,
            referenceId: userExists._id,  // Store the selected candidate/electoral officer/student id
        });

        // Save the user to the database
        await newUser.save();

        return { message: 'User account created successfully.', user: newUser };
    }

    static async deleteUser(userId){
        return await User.deleteOne({_id: userId})
    }

    static async getUserById(userId){
        return await User.findById({_id: userId})
    }

    static async getUserByReferenceId(referenceId){
        return await User.findOne({referenceId: referenceId})
    }

    static async listAllUsers(){
        return await User.find({})
    }

    static async updateUser(userId, {username, password}) {
        // Find the respective user
        const theUser = await this.getUserById(userId);
        if (!theUser) {
            throw new CustomError('User not found', ErrorCodes.NOT_FOUND, 404);
        }
    
        // Validate username
        if (!username) {
            throw new CustomError('Username cannot be empty!', ErrorCodes.MISSING_REQUIRED_FIELD, 400);
        }
    
        const usernameExists = await User.findOne({username: username});
        if (usernameExists && userId !== usernameExists._id.toString()) {
            throw new CustomError('That username exists, please choose another one!', ErrorCodes.USERNAME_EXISTS, 400);
        }
    
        // Hash password if provided
        let updateData = { username };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }
    
        return await User.findByIdAndUpdate(
            {_id: userId},
            {$set: updateData},
            {new: true}
        );
    }
    
}

