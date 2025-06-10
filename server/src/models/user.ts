import { Schema, Document, Types, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    avatar?: string;
    roleId: Types.ObjectId;
    isActive: Boolean;
    comparePassword: (enteredPassword: string) => boolean;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        roleId: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (
    this: IUser,
    enteredPassword: string
) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = model<IUser>('User', userSchema);
