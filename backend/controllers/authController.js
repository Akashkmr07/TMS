const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { Resend } = require('resend');

const resendApiKey = 're_2qThGjbj_9sJKYA5vHPFwC5eBfbh8MuKZ';
const resend = new Resend(resendApiKey);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

// @route   POST /api/users/register
const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            try {
                // In testing mode, always send to your verified email with original recipient in subject
                const emailConfig = {
                    from: 'noreply@tmsystem.com',
                    to: email, // Now we can send to any email since domain is verified
                    subject: 'Welcome to TMS - Registration Successful',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h1 style="color: #2563eb;">Welcome to TMS!</h1>
                            <p>Hi ${name},</p>
                            <p>Thank you for registering with our Task Management System. Your account has been successfully created.</p>
                            <p>You can now:</p>
                            <ul>
                                <li>Create and manage tasks</li>
                                <li>Track your progress</li>
                                <li>Collaborate with team members</li>
                                <li>View analytics</li>
                            </ul>
                            <p>Get started by logging in to your account.</p>
                            <p style="margin-top: 20px;">Best regards,<br>The TMS Team</p>
                        </div>
                    `
                };

                const emailResponse = await resend.emails.send(emailConfig);
                console.log('Email sent successfully:', emailResponse);
            } catch (emailError) {
                console.error('Email sending failed:', emailError.message);
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// @route   POST /api/users/login
const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// @route   GET /api/users/me
const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Failed to get user data' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};