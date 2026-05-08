// services/verification.service.ts
import crypto from 'crypto';
import { User } from '../models/auth/user.models';
import { Shop } from '../models/auth/companyRegister.models';
import { emailService } from './email.service';
import { VerificationEmailTemplate } from '../templates/auth/verification.template.ts';
import { WelcomeEmailTemplate } from '../templates/auth/welcome.template';
import { BaseEmailTemplate, CompanyBranding } from '../templates/base.template';

export class VerificationService {
    static generateVerificationToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    static async sendVerificationEmail(userId: string, shopId: string): Promise<void> {
        try {
            const user = await User.findById(userId);
            const shop = await Shop.findById(shopId);

            if (!user || !shop) {
                throw new Error('User or Shop not found');
            }

            const token = this.generateVerificationToken();
            const expiryHours = 24;
            const tokenExpiry = new Date();
            tokenExpiry.setHours(tokenExpiry.getHours() + expiryHours);

            user.verificationToken = token;
            user.verificationTokenExpiry = tokenExpiry;
            await user.save();

            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const verificationLink = `${baseUrl}/auth/verify-email?token=${token}&email=${user.email}`;

            // Get full logo URL
            const companyLogoUrl = shop.logo 
                ? `${process.env.BACKEND_URL || 'http://localhost:5000'}${shop.logo}`
                : undefined;

            // Company branding with three colors
            const companyBranding: CompanyBranding = {
                companyName: shop.shopName,
                companyLogo: companyLogoUrl,
                companyAddress: shop.companyAddress,
                primaryColor: shop.primaryColor,
                secondaryColor: shop.secondaryColor,
                accentColor: shop.accentColor,
                companyEmail: shop.companyEmail || shop.email,
                supportEmail: shop.supportEmail
            };

            const template = new VerificationEmailTemplate();
            const emailContent = template.generate({
                userName: `${user.firstName} ${user.lastName}`,
                companyName: shop.shopName,
                verificationLink: verificationLink,
                expiryHours: expiryHours,
                supportEmail: shop.supportEmail || process.env.SUPPORT_EMAIL || 'support@example.com'
            });

            const baseTemplate = new BaseEmailTemplate({
                appName: process.env.APP_NAME || 'SaaS Platform',
                appColor: shop.primaryColor,
                accentColor: shop.accentColor
            });

            const fullHtml = baseTemplate.wrapContent(emailContent, {
                preheader: `Verify your email for ${shop.shopName}`,
                title: 'Email Verification',
                branding: companyBranding
            });

            await emailService.sendEmail({
                to: user.email,
                subject: `Verify Your Email - ${shop.shopName}`,
                html: fullHtml
            });

            console.log(`Verification email sent to ${user.email} for ${shop.shopName}`);
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw error;
        }
    }

    static async verifyEmail(token: string, email: string): Promise<{ success: boolean; companyName: string }> {
        try {
            const user = await User.findOne({
                email: email,
                verificationToken: token,
                verificationTokenExpiry: { $gt: new Date() }
            });
console.log("user", user)
            if (!user) {
                throw new Error('Invalid or expired verification token');
            }

            user.isVerified = true;
            user.verificationToken = null;
            user.verificationTokenExpiry = undefined;
            user.isActive = true;
            await user.save();

            const shop = await Shop.findById(user.shopId);
            
            if (shop) {
                await this.sendWelcomeEmail(user, shop);
            }

            return { 
                success: true, 
                companyName: shop?.shopName || 'your company' 
            };
        } catch (error) {
            console.error('Error verifying email:', error);
            throw error;
        }
    }

    static async sendWelcomeEmail(user: any, shop: any): Promise<void> {
        try {
            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const companyLogoUrl = shop.logo 
                ? `${process.env.BACKEND_URL || 'http://localhost:5000'}${shop.logo}`
                : undefined;

            const companyBranding: CompanyBranding = {
                companyName: shop.shopName,
                companyLogo: companyLogoUrl,
                companyAddress: shop.companyAddress,
                primaryColor: shop.primaryColor,
                secondaryColor: shop.secondaryColor,
                accentColor: shop.accentColor,
                companyEmail: shop.companyEmail || shop.email,
                supportEmail: shop.supportEmail
            };

            const template = new WelcomeEmailTemplate();
            const emailContent = template.generate({
                userName: `${user.firstName} ${user.lastName}`,
                companyName: shop.shopName,
                loginUrl: `${baseUrl}/auth/signin`,
                dashboardUrl: `${baseUrl}/dashboard`,
                supportEmail: shop.supportEmail || process.env.SUPPORT_EMAIL || 'support@example.com'
            });

            const baseTemplate = new BaseEmailTemplate({
                appName: process.env.APP_NAME || 'SaaS Platform',
                appColor: shop.primaryColor,
                accentColor: shop.accentColor
            });

            const fullHtml = baseTemplate.wrapContent(emailContent, {
                preheader: `Welcome to ${shop.shopName}`,
                title: 'Welcome Aboard!',
                branding: companyBranding
            });

            await emailService.sendEmail({
                to: user.email,
                subject: `Welcome to ${shop.shopName}! 🎉`,
                html: fullHtml
            });
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }
    }

    static async resendVerificationEmail(email: string): Promise<void> {
        const user = await User.findOne({ email: email });
        
        if (!user) {
            throw new Error('User not found');
        }

        if (user.isVerified) {
            throw new Error('Email already verified');
        }

        if (!user.shopId) {
            throw new Error('No shop associated with this user');
        }

        await this.sendVerificationEmail(user._id.toString(), user.shopId.toString());
    }
}