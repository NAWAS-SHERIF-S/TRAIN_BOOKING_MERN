import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import ApiError from '../utils/ApiError.js';

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new ApiError(400, 'Please provide all required fields'));
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new ApiError(400, 'User already exists'));
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id),
                },
            });
        }
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ApiError(400, 'Please provide email and password'));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ApiError(401, 'Invalid credentials'));
        }

        const isPasswordMatch = await user.matchPassword(password);

        if (!isPasswordMatch) {
            return next(new ApiError(401, 'Invalid credentials'));
        }

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return next(new ApiError(403, 'Not authorized as admin'));
        }
        
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};
