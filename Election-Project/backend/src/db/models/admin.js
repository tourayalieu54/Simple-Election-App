import mongoose, {Schema} from "mongoose";

const adminSchema = new Schema({
    firstName : {type: String, required: true},
    middleName: String,
    lastName: {type:String, required:true},
    occupation: {type:String, required: true},
    staffId: {type:String, required: true, unique: true}
},{Timestamp: true})

export const Admin = mongoose.model('admin', adminSchema)
