import { ElectoralOfficer } from '../db/models/electoralOfficer.js';
import { Role } from './enum.js';

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

export async function createOfficer({officerInfo, role}){
    if(!Object.values(Role).includes(role)) throw new Error("Invalid Role");
    const officer = new ElectoralOfficer({officerInfo, role});
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
    return await ElectoralOfficer.findByIdAndDelete({_id: officerId})
}


