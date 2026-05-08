// controllers/auth/companyRegister.controller.ts
import { Request, Response } from "express";
import { User } from "../../models/auth/user.models";
import { Shop } from "../../models/auth/companyRegister.models";
import { hashPassword } from "../../services/auth.service";
import { VerificationService } from "../../services/verification.service";

export const registerShopDetails = async (req: Request, res: Response) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            emailId,
            companyName,
            mobileNumber,
            phoneNumber,
            companyWebsite,
            companyAddress,
            country,
            zipCode,
            latitude,
            longitude,
            password,
            confirmPassword,
            // Color scheme fields
            primaryColor = "#1e293b",
            secondaryColor = "#3b82f6",
            accentColor = "#8b5cf6",
            companyEmail,
            supportEmail
        } = req.body;

        // Logo handling
        let logoPath = "";
        if (req.file) {
            logoPath = `/uploads/${req.file.filename}`;
            console.log("Logo uploaded:", logoPath);
        }

        // Validate password
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check existing user
        const existingUser = await User.findOne({ email: emailId });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create User
        const newUser = await User.create({
            email: emailId,
            password: hashedPassword,
            role: "Admin",
            isActive: true,
            isVerified: false,
            isDeleted: false,
            firstName: firstName || "",
            middleName: middleName || "",
            lastName: lastName || "",
            mobileNumber: mobileNumber || "",
        });

        // Create Shop with color scheme
        const newShop = await Shop.create({
            shopName: companyName || "",
            userId: newUser._id,
            email: emailId,
            phoneNumber: phoneNumber || "",
            companyWebsite: companyWebsite || "",
            companyAddress: companyAddress || "",
            country: country || "",
            zipCode: zipCode || "",
            latitude: latitude || "",
            longitude: longitude || "",
            logo: logoPath,
            primaryColor: primaryColor,
            secondaryColor: secondaryColor,
            accentColor: accentColor,
            companyEmail: companyEmail || emailId,
            supportEmail: supportEmail || process.env.SUPPORT_EMAIL || "support@example.com",
            isActive: true,
            isDeleted: false,
        });

        // Update User with shopId
        newUser.shopId = newShop._id;
        await newUser.save();

        // Send verification email
        await VerificationService.sendVerificationEmail(newUser._id.toString(), newShop._id.toString());

        return res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email to verify your account.",
            userId: newUser._id,
            shopId: newShop._id,
            shopLogo: logoPath,
            email: newUser.email,
            requiresVerification: true
        });

    } catch (error: any) {
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};