const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/nodemailer');
const otpGenerator = require('otp-generator');
const { signUpTemplate } = require('../utils/emailTemplate');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

exports.register = async (req, res, next) => {
    try {
        const { name, email, phoneNumber, password, confirmPassword } = req.body;

        const emailExists = await userModel.findOne({ email: email })
        if (emailExists) {
            return next({
                message: `User with email: ${email} already exists`,
                statusCode: 400
            })
        }

        if (password !== confirmPassword) {
            return next({
                message: `Password does not match`,
                statusCode: 400
            })
        }

        const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        const expiresAt = new Date(Date.now() + 10 * 60000);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            name,
            email,
            phoneNumber,
            otp: OTP,
            password: hashedPassword,
            otpExpiresAt: expiresAt
        });

        

        const emailOptions = {
            email: user.email,
            subject: 'Welcome to The Girly Zone',
            html: signUpTemplate(user.name, OTP)
        }
        console.log("2");

        await sendMail(emailOptions);
        // console.log("2");
        // console.log(mail);
        // console.log("3");

        const data = {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber
        }

        res.status(201).json({
            message: 'User created successfully',
            data
        })
    } catch (error) {
        next({
            message: error.message,
            statusCode: 500
        })
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await userModel.findOne({ email })
        if (!user) {
            return next({
                message: `User not found`,
                statusCode: 404
            })
        }
        if (new Date() > user.otpExpiresAt || user.otp != otp) {
            return next({
                message: `Invalid OTP`,
                statusCode: 404
            })
        }

        user.isVerified = true;
        user.otp = null
        user.otpExpiresAt = null

        await user.save()

        res.status(200).json({
            message: 'User verified successfully'
        })

    } catch (error) {
        next({
            message: error.message,
            statusCode: 500
        })
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email })
        if (!user) {
            return next({
                message: `User not found`,
                statusCode: 404
            })
        }

        const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })

        const expiresAt = new Date(Date.now() + 10 * 60000);

        user.otp = OTP;
        user.otpExpiresAt = expiresAt;

        const emailOptions = {
            email: user.email,
            subject: 'New otp confirmation',
            html: signUpTemplate(user.name, OTP)
        }

        await sendMail(emailOptions);

        await user.save()

        res.status(200).json({
            message: 'OTP resent successfully'
        })
    } catch (error) {
        next({
            message: error.message,
            statusCode: 500
        })
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return next({
                message: `User not found`,
                statusCode: 404
            })
        }

        // if (user.isVerified == false) {
        //     return next({
        //         message: `Please verify email`,
        //         statusCode: 404
        //     })
        // }
        // Check if account is locked due to too many failed login attempts
        if ( user.lockUntil > Date.now()) {
            return next({
                message: `Account locked until ${user.lockUntil}`,
                statusCode: 403
            })
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            // Increment login attempts and lock account if necessary
            user.loginAttempts += 1;
            if(user.loginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 2 * 60000);
                user.loginAttempts = 0;
            }
            await user.save();
            return next({
                message: `Invalid Credentials`,
                statusCode: 400
            })
        }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        await user.save();

        const token = await jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1day' });
        // Delete existing token in Redis to prevent multiple active sessions
        redisClient.del(`user:${user._id}`);
        // Store the token in Redis with an expiration time
        redisClient.set(`user:${user._id}`, token, {EX: 86400})

        res.status(200).json({
            message: 'Login Successful',
            token
        })
    } catch (error) {
        next({
            message: error.message,
            statusCode: 500
        })
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find().select('-password');
        res.status(200).json({
            message: 'All users fetched successfully',
            users
        })
    } catch (error) {
        next(error);
    }
}

exports.getUserById = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.params.id).select('-password');
        if (!user) {
            return next({
                message: `User not found`,
                statusCode: 404
            })
        }
        res.status(200).json({
            message: 'User fetched successfully',
            user
        })
    } catch (error) {
        next(error);
    }
}

exports.logout = (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const id = req.user.id
        // Delete the token from Redis to invalidate it
        redisClient.del(`user:${id}`);
        // Send a success response
        res.status(200).json({
            message: 'Logout successful'
        });
    } catch (error) {
        next(error);
    }
}