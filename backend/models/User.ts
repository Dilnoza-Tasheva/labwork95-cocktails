import * as mongoose from "mongoose";
import {Model} from "mongoose";
import bcrypt from "bcrypt";
import {UserFields} from "../types";
import {randomUUID} from "node:crypto";

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>;

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema<UserFields, UserModel, UserMethods>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: async function(value: string): Promise<boolean> {
                if (!this.isModified('username')) {
                    return true;
                }
                const user = await User.findOne({username: value});
                return Boolean(!user);
            },
            message: 'Username already in use'
        }
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin']
    },
    displayName: String,
    googleId: String,
});

UserSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

UserSchema.set('toJSON', {
    transform: (_doc, ret: Partial<UserFields>) => {
        delete ret.password;
        return ret;
    }
});

UserSchema.methods.checkPassword = function(password: string) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function() {
    this.token = randomUUID();
}

const User = mongoose.model<UserFields, UserModel>('User', UserSchema);
export default User;