import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Officer', 'Candidate', 'Voter', 'Admin'], 
        required: true,
    },
    referenceId: {
        type: Schema.Types.ObjectId,
        refPath: 'role', //dynamic model reference based on the value of the role field
        required: true,
    },
}, { timestamps: true });


// Middleware for hashing the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to validate the password
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model('user', userSchema);
