// services/otpEmail.service.ts
import { emailService } from "./email.service";
import { CompanyBranding } from "../templates/base.template";
import { BaseEmailTemplate } from "../templates/base.template";

export interface OTPEmailData {
    otpCode: string;
    userName: string;
    companyName: string;
    expiryMinutes: number;
    supportEmail: string;
}

export class OTPEmailService {
    static async sendOTPEmail(
        to: string,
        otpData: OTPEmailData,
        branding?: CompanyBranding
    ): Promise<boolean> {
        try {
            const htmlContent = this.generateOTPEmailHTML(otpData, branding);
            
            // Use your existing email service
            await emailService.sendEmail({
                to: to,
                subject: `Password Reset OTP - ${otpData.companyName}`,
                html: htmlContent
            });
            
            return true;
        } catch (error) {
            console.error('Failed to send OTP email:', error);
            return false;
        }
    }

    private static generateOTPEmailHTML(data: OTPEmailData, branding?: CompanyBranding): string {
        const primaryColor = branding?.primaryColor || '#1e293b';
        const secondaryColor = branding?.secondaryColor || '#3b82f6';
        const accentColor = branding?.accentColor || '#8b5cf6';
        const gradientStyle = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`;
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset OTP</title>
                <style>
                    @media only screen and (max-width: 600px) {
                        .container { width: 100% !important; }
                        .otp-code { font-size: 28px !important; padding: 12px !important; }
                    }
                </style>
            </head>
            <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f4f5f7;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f5f7; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="560" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.05);">
                                
                                <!-- Header with Gradient -->
                                <tr>
                                    <td style="background: ${gradientStyle}; padding: 40px 30px; text-align: center;">
                                        ${branding?.companyLogo ? `
                                            <img src="${branding.companyLogo}" alt="${branding.companyName}" style="max-width: 120px; margin-bottom: 20px; border-radius: 8px;">
                                        ` : ''}
                                        <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 700;">Password Reset</h1>
                                        <p style="margin: 12px 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">
                                            ${branding?.companyName || 'SaaS Platform'}
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="margin: 0 0 16px; font-size: 22px; color: #1f2937;">Hello ${data.userName}! 👋</h2>
                                        
                                        <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #4b5563;">
                                            We received a request to reset your password for your account. Use the OTP code below to proceed with resetting your password.
                                        </p>
                                        
                                        <!-- OTP Code Box -->
                                        <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                                            <p style="margin: 0 0 8px; font-size: 12px; color: #6b7280; letter-spacing: 2px;">YOUR VERIFICATION CODE</p>
                                            <div class="otp-code" style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: ${primaryColor}; background: white; display: inline-block; padding: 16px 32px; border-radius: 12px; font-family: monospace;">
                                                ${data.otpCode}
                                            </div>
                                        </div>
                                        
                                        <!-- Expiry Info -->
                                        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px; border-radius: 8px;">
                                            <p style="margin: 0; font-size: 13px; color: #78350f;">
                                                ⏰ This OTP is valid for <strong>${data.expiryMinutes} minutes</strong>. Do not share this code with anyone.
                                            </p>
                                        </div>
                                        
                                        <!-- Instructions -->
                                        <div style="margin-bottom: 24px;">
                                            <h3 style="margin: 0 0 12px; font-size: 15px; color: #1f2937;">📝 Instructions</h3>
                                            <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 13px; line-height: 1.8;">
                                                <li>Enter this OTP on the password reset page</li>
                                                <li>You'll be prompted to create a new password</li>
                                                <li>If you didn't request this, please ignore this email</li>
                                            </ul>
                                        </div>
                                        
                                        <!-- Need Help -->
                                        <div style="background: #eff6ff; border-radius: 12px; padding: 16px;">
                                            <p style="margin: 0; font-size: 12px; color: #1e40af;">
                                                ❓ Need help? Contact our support team at 
                                                <a href="mailto:${data.supportEmail}" style="color: #2563eb;">${data.supportEmail}</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 24px 30px; background: #f8fafc; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="margin: 0; font-size: 11px; color: #6b7280;">
                                            © ${new Date().getFullYear()} ${branding?.companyName || 'SaaS Platform'}. All rights reserved.
                                        </p>
                                        <p style="margin: 8px 0 0; font-size: 10px; color: #9ca3af;">
                                            This is an automated message. Please do not reply to this email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;
    }
}