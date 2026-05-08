// controllers/auth/login.controller.ts
import { Request, Response } from "express";
import { User } from "../../models/auth/user.models";
import { Shop } from "../../models/auth/companyRegister.models";
import { comparePassword, generateToken, hashPassword } from "../../services/auth.service";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email, isDeleted: false });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ 
                message: "Please verify your email address before logging in",
                requiresVerification: true,
                email: user.email
            });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Your account has been deactivated" });
        }

        const isValidPassword = await comparePassword(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const shop = await Shop.findById(user.shopId);

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });

        // Get full logo URL
        const logoUrl = shop?.logo ? `${process.env.BACKEND_URL || 'http://localhost:5000'}${shop.logo}` : null;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                shopId: user.shopId,
                shopName: shop?.shopName,
                companyLogo: logoUrl,
                isVerified: user.isVerified,
                // Company branding
                primaryColor: shop?.primaryColor,
                secondaryColor: shop?.secondaryColor,
                accentColor: shop?.accentColor
            }
        });

    } catch (error: any) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed" });
    }
};


export const setupPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;
console.log("token", token, "password", password)
        const user = await User.findOne({ emailToken: token, emailTokenExpires: { $gt: new Date() } }) as any;
        console.log("user", user)
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        // Hash password
        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;
        user.isActive = true;
        user.emailToken = undefined;
        user.emailTokenExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Account activated successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};