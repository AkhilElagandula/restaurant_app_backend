import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
// Define TypeScript enums for role and gender
enum Role {
  User = 'user',
  Customer = 'customer',
  SubAdmin = 'sub-admin',
  Admin = 'admin',
}

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

interface IUser extends Document {
  name: string;
  email: string;
  photo?: string;
  role: Role;
  password: string;
  age?: number;
  gender?: Gender;
  phone?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  address?: string;
  active?: boolean;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

interface UserModel extends Model<IUser> {
  getUserByIds(ids: string[]): Promise<IUser[]>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.User,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: true,
  },
  age: {
    type: Number,
    select: true,
    required: false,
    //  [function(this: IUser) {
    //   return this.role === Role.User || this.role === Role.Admin;
    // }, 'Age is required!']
  },
  gender: {
    type: String,
    enum: Object.values(Gender),
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  address: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Instance method to compare passwords
userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string): Promise<boolean> {
  return candidatePassword === userPassword;
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
