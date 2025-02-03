import { Admin } from "../db/models/admin.js";
import CustomError,{ ErrorCodes } from "./customError.service.js";
import { userService } from "./user.js";

export async function createAdmin ({firstName, middleName, lastName, occupation, staffId}){
    const newAdmin = new Admin({firstName, middleName, lastName, occupation, staffId});
    return await newAdmin.save()
}

export async function findAdminById(adminId){
    return await Admin.findById({_id: adminId})
}

export async function findAdminByStaffId(stafId){
    console.log('Here is staff id from the admin service: ', stafId)
    return await Admin.findOne({staffId: stafId})
}

export async function listAllAdmins(){
    return await Admin.find({})
}

export async function updateAdmin(adminId, {occupation, firstName, middleName, lastName}){
    return await Admin.findOneAndUpdate(
        {_id: adminId},
        {$set: {occupation, firstName, middleName, lastName}},
        {new: true}
    )
}

export async function deleteAdmin(adminId){
    //Make sure there is atleast two admins before deleting one
    const admins = await listAllAdmins();
    if(admins.length < 2){
        throw new CustomError('You can\'t delete all the admins, there must be at least one admin left after every admin deletion!', ErrorCodes.NOT_FOUND, 400)
    }

    const userAccount = await userService.getUserByReferenceId(adminId)
    if(userAccount) await userService.deleteUser(userAccount._id)
    return await Admin.findOneAndDelete({_id: adminId});
}