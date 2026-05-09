// controllers/auth/otp.controller.ts
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { User } from "../../models/auth/user.models";
import { Shop } from "../../models/auth/companyRegister.models";
import { OTPMODEL } from "../../models/otp.models";
import { GenerateOtp } from "../../utils/generate.otps.utls";
import { hashPassword } from "../../services/auth.service";
import { OTPEmailService } from "../../services/otpEmail.service";

export const GenerateOTP = async (req: Request, res: Response) => {
    try {
        const { emailId } = req.body;
        if (!emailId) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Find user
        const user = await User.findOne({ email: emailId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Account is not active" });
        }

        if (user.isDeleted) {
            return res.status(403).json({ message: "Account has been deleted" });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({ 
                message: "Please verify your email first. Check your inbox for verification link.",
                requiresVerification: true
            });
        }

        // Get shop for branding
        const shop = await Shop.findById(user.shopId);
        
        // Generate OTP
        const otpCode = GenerateOtp();
        const expiryMinutes = 5;
        const otpExpiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        // Remove old OTP if exists
        await OTPMODEL.deleteMany({ emailId });

        // Save new OTP
        const otpRecord = await OTPMODEL.create({
            otpCode,
            emailId,
            optExpiresAt: otpExpiresAt,
            otpAttempts: 0,
            isVerified: false
        });

        if (!otpRecord) {
            return res.status(500).json({ message: "Failed to generate OTP" });
        }

        // Prepare email branding
        const branding = shop ? {
            companyName: shop.shopName,
            companyLogo: shop.logo ? `${process.env.BACKEND_URL || 'http://localhost:5000'}${shop.logo}` : undefined,
            companyAddress: shop.companyAddress,
            primaryColor: shop.primaryColor,
            secondaryColor: shop.secondaryColor,
            accentColor: shop.accentColor,
            companyEmail: shop.companyEmail,
            supportEmail: shop.supportEmail
        } : undefined;

        // Send OTP email using your email service
        const emailSent = await OTPEmailService.sendOTPEmail(
            emailId,
            {
                otpCode: otpCode,
                userName: `${user.firstName} ${user.lastName}`,
                companyName: shop?.shopName || 'SaaS Platform',
                expiryMinutes: expiryMinutes,
                supportEmail: shop?.supportEmail || process.env.SUPPORT_EMAIL || 'support@example.com'
            },
            branding
        );

        if (!emailSent) {
            // Delete OTP if email failed
            await OTPMODEL.deleteMany({ emailId });
            return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email successfully",
            emailSent: true
        });

    } catch (error) {
        console.error("Generate OTP error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const VerifyOTP = async (req: Request, res: Response) => {
    try {
        const { otp, emailId } = req.body;

        if (!emailId || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email: emailId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Account is not active" });
        }

        if (user.isDeleted) {
            return res.status(403).json({ message: "Account has been deleted" });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({ 
                message: "Email not verified. Please verify your email first."
            });
        }

        const otpRecord = await OTPMODEL.findOne({ emailId });

        if (!otpRecord) {
            return res.status(404).json({
                message: "OTP not found. Request a new one."
            });
        }

        if (otpRecord.isVerified) {
            return res.status(400).json({
                message: "OTP already verified. Request a new one."
            });
        }

        if (!otpRecord.optExpiresAt || otpRecord.optExpiresAt < new Date()) {
            await OTPMODEL.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({
                message: "OTP expired. Request a new one."
            });
        }

        // Check attempts
        if (otpRecord.otpAttempts >= 5) {
            await OTPMODEL.deleteOne({ _id: otpRecord._id });
            return res.status(429).json({
                message: "Maximum OTP attempts exceeded. Request a new OTP."
            });
        }

        if (otpRecord.otpCode !== otp) {
            otpRecord.otpAttempts += 1;
            await otpRecord.save();
            
            const remainingAttempts = 5 - otpRecord.otpAttempts;
            return res.status(400).json({ 
                message: `Invalid OTP. ${remainingAttempts} attempts remaining.`
            });
        }

        // OTP is valid
        otpRecord.isVerified = true;
        await otpRecord.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can now reset your password."
        });

    } catch (error) {
        console.error("Verify OTP error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const UpdatePassword = async (req: Request, res: Response) => {
    try {
        const { emailId, password, confirmPassword } = req.body;

        if (!emailId || !password || !confirmPassword) {
            return res.status(400).json({
                message: "Email, password and confirm password are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password and confirm password must match"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const user = await User.findOne({ email: emailId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Account is not active" });
        }

        if (user.isDeleted) {
            return res.status(403).json({ message: "Account has been deleted" });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({ 
                message: "Email not verified. Please verify your email first."
            });
        }

        const otpRecord = await OTPMODEL.findOne({ emailId });

        if (!otpRecord) {
            return res.status(404).json({
                message: "OTP not found. Request a new OTP first."
            });
        }

        if (!otpRecord.isVerified) {
            return res.status(400).json({
                message: "OTP not verified. Please verify OTP first."
            });
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update password
        await User.findOneAndUpdate(
            { email: emailId },
            { $set: { password: hashedPassword } }
        );

        // Clean up - delete all OTP records for this user
        await OTPMODEL.deleteMany({ emailId });

        // Optional: Send password change confirmation email
        // await sendPasswordChangeConfirmation(emailId, user.firstName);

        return res.status(200).json({
            success: true,
            message: "Password updated successfully. You can now login with your new password."
        });

    } catch (error) {
        console.error("Update password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};