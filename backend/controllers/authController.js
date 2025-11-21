import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: 'Missing Details'
        })
    }

    try {

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword
        })

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Secure in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'lax' for localhost
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Sending welcome Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to our Website',
            text: `Hello ${name}, Welcome to our Website. Your account has been created with email id: ${email} We are glad to have you on
            board.`
        }

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "Register Success"
        })

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Email and Password are required"
        })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Email"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Password"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Secure in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'lax' for localhost
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "Login Success"
        })

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

export const logout = async (req, res) => {
    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        })

        return res.json({
            success: true,
            message: "Logout Success"
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

// check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const hashedOtp = await bcrypt.hash(otp, 10); // Hash the OTP before storing

        user.resetOtp = hashedOtp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}. This OTP is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "OTP sent to your Email" });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Reset User Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "Email, OTP, and new password are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.resetOtp) {
            return res.status(400).json({ success: false, message: "OTP request not found" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        const isOtpValid = await bcrypt.compare(otp, user.resetOtp);
        if (!isOtpValid) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // Ensure password is strong
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = null;
        user.resetOtpExpireAt = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Password has been reset successfully" });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
