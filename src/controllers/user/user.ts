import catchAsync from "../../utils/catchAsync"
import AppError from "../../utils/appError";
import { sendResponse } from "../../helper/response";
import { Request, Response, NextFunction } from "express";
import User from "../../models/user";
import Token from "../../models/tokens";
import { generateAccessToken } from "../../helper/auth";


export const handleSignUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, role, age, gender, phone, address } = req.body;

        // Check for required fields
        if (!name || !email || !password) {
            return sendResponse(res, 400, 'fail', 'Name, email, and password are required fields.');
        }

        // Create a new user
        const newUser = await User.create({
            name,
            email,
            password,
            role,
            age,
            gender,
            phone,
            address,
            createdAt: new Date(),
        });
        if (!newUser) {
            return sendResponse(res, 500, 'error', 'User creation failed. Please try again.');
        }

        sendResponse(res, 201, 'Success', 'User created Successfully.');
    } catch (error) {
        next(error);
    }
})

export const handleLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { emailOrMobile, password } = req.body;
        if (!emailOrMobile || !password) {
            return sendResponse(res, 400, 'fail', 'Email, and password are required fields.');
        }

        // Determine if the input is an email or mobile number
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile);

        const user = await User.findOne(isEmail ? { email: emailOrMobile } : { mobile: emailOrMobile });
        if (!user) {
            return sendResponse(res, 404, 'fail', 'User not found.');
        }
        // Check if the provided password matches the user's password
        const isPasswordValid = await user.correctPassword(password, user.password);
        if (!isPasswordValid) {
            return sendResponse(res, 401, 'fail', 'Incorrect password.');
        }

        // If successful, return a success response (you can also generate a token here if needed)
        const accessToken = await generateAccessToken(user);
        const userDetails = {
            aToken: accessToken,
            name: user.name,
            mobile: user.phone,
            email: user.email,
            role: user.role
        };
        sendResponse(res, 200, 'success', 'Login successful', userDetails);
        await handleTokenDetails(user.id, accessToken)
    }
    catch (Exception) {
        console.log(Exception)
    }
})

// Get User by ID
export const findOneUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const findAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve all users from the database
        const users = await User.find();

        // Send response with all users
        return sendResponse(res, 200, 'success', 'Users retrieved successfully', users);
    } catch (error) {
        console.log(error);
        return next(error);
    }
});

// Update User
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Delete User
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

const handleTokenDetails = async (userId: string, tokenString: string) => {
    try {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 5);
        const existingToken = await Token.findOne({ user: userId });
        if (existingToken) {
            // Update the existing entry if a token already exists for the user
            existingToken.token = tokenString;
            existingToken.expiresAt = expiration;
            existingToken.createdAt = new Date();
      
            await existingToken.save();
          } else {
            // Insert a new entry if no token exists for the user
            await Token.create({
              user: userId,
              token: tokenString,
              expiresAt: expiration,
              createdAt: new Date()
            });
          }
    } catch (error) {
        console.log(error);
        return new AppError("Error saving the token details", 500);
    }

}; 