// templates/verification.template.ts
export class VerificationEmailTemplate {
    generate(data: {
        userName: string;
        companyName: string;
        verificationLink: string;
        expiryHours: number;
        supportEmail: string;
    }): string {
        return `
            <div style="padding: 40px;">
                <h2 style="margin: 0 0 16px; font-size: 24px; color: #1f2937;">
                    Hello ${data.userName}! 👋
                </h2>
                
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Thank you for registering <strong>${data.companyName}</strong>. 
                    Please verify your email address to start using our services.
                </p>

                <div style="background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                    <p style="margin: 0 0 8px;">
                        <strong style="color: #1f2937;">🏢 Company:</strong>
                        <span style="color: #4b5563; margin-left: 8px;">${data.companyName}</span>
                    </p>
                    <p style="margin: 0;">
                        <strong style="color: #1f2937;">📧 Account Email:</strong>
                        <span style="color: #4b5563; margin-left: 8px;">${data.userName}</span>
                    </p>
                </div>

                <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${data.verificationLink}" 
                       style="display: inline-block; 
                              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                              color: #ffffff;
                              text-decoration: none;
                              padding: 14px 36px;
                              border-radius: 50px;
                              font-weight: 600;
                              font-size: 16px;
                              box-shadow: 0 4px 12px rgba(59,130,246,0.3);">
                        ✓ Verify Email Address
                    </a>
                </div>

                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 32px; border-radius: 8px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #78350f;">
                        <strong>🔗 Can't click the button?</strong>
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #78350f; word-break: break-all;">
                        Copy and paste this link: <a href="${data.verificationLink}" style="color: #d97706;">${data.verificationLink}</a>
                    </p>
                </div>

                <div style="margin-bottom: 32px;">
                    <h3 style="margin: 0 0 12px; font-size: 16px; color: #1f2937;">⏰ Important</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                        <li>Link expires in <strong>${data.expiryHours} hours</strong></li>
                        <li>Check your spam folder if email not received</li>
                        <li>Contact support at <a href="mailto:${data.supportEmail}" style="color: #3b82f6;">${data.supportEmail}</a></li>
                    </ul>
                </div>
            </div>
        `;
    }
}