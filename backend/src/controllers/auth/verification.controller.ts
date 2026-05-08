// controllers/auth/verification.controller.ts
import { Request, Response } from "express";
import { VerificationService } from "../../services/verification.service";

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token, email } = req.query;

        if (!token || !email) {
            return res.status(400).json({ message: "Invalid verification link" });
        }

        const result = await VerificationService.verifyEmail(token as string, email as string);

        // Redirect ki bajaye JSON bhejain
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            companyName: result.companyName
        });

    } catch (error: any) {
        console.error("Verification error:", error);
        // Catch block mein bhi JSON response bhejain
        return res.status(400).json({
            success: false,
            message: error.message || "Verification failed"
        });
    }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        await VerificationService.resendVerificationEmail(email);

        return res.status(200).json({
            success: true,
            message: "Verification email resent successfully"
        });

    } catch (error: any) {
        console.error("Resend error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to resend verification email"
        });
    }
};