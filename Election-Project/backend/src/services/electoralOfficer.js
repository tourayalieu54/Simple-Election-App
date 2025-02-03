import { ElectoralOfficer } from '../db/models/electoralOfficer.js';
import CustomError, {ErrorCodes} from './customError.service.js';
import { findStudentById } from './student.js';
import { userService } from './user.js';

export async function findOfficerById(officerId){
    return await ElectoralOfficer.findById(officerId)
}

export async function findByMatNumber(matNumber){
    return await ElectoralOfficer.findOne({}).
    populate({
        path: 'officerInfo',
        match: {matNumber}
    }).then(officer => (officer && officer.officerInfo ? officer : null))
}

export async function listAllOfficers(){
    return await ElectoralOfficer.find({})
}

export async function createOfficer({officerInfo, position}){
    const student = await findStudentById(officerInfo);
    if(!student){
        throw new CustomError('An electoral officer must be an existing student in the system!', ErrorCodes.NOT_FOUND, 404)
    }
    const officer = new ElectoralOfficer({officerInfo, position});
    return await officer.save()
}

export async function updateOfficer(officerId, {role}){
    return await ElectoralOfficer.findByIdAndUpdate(
        {_id: officerId},
        {$set: {role}},
        {new: true}
    )
}

export async function deleteOfficer(officerId){
    const user = await userService.getUserByReferenceId(officerId)
    if(user){ await userService.deleteUser(user._id)}
    return await ElectoralOfficer.findByIdAndDelete({_id: officerId})
}


