// templates/welcome.template.ts
export class WelcomeEmailTemplate {
    generate(data: {
        userName: string;
        companyName: string;
        loginUrl: string;
        dashboardUrl: string;
        supportEmail: string;
    }): string {
        return `
            <div style="padding: 40px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="font-size: 56px;">🎉</div>
                </div>
                
                <h2 style="margin: 0 0 16px; font-size: 28px; color: #1f2937; text-align: center;">
                    Welcome ${data.userName}! 👋
                </h2>
                
                <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                    Your email has been successfully verified. You're now ready to manage 
                    <strong>${data.companyName}</strong>.
                </p>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 12px;">
                        <div style="font-size: 32px;">✅</div>
                        <div style="font-size: 13px; font-weight: 600; margin-top: 8px; color: #166534;">Verified</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 12px;">
                        <div style="font-size: 32px;">🏢</div>
                        <div style="font-size: 13px; font-weight: 600; margin-top: 8px; color: #1e40af;">Active</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px;">
                        <div style="font-size: 32px;">🚀</div>
                        <div style="font-size: 13px; font-weight: 600; margin-top: 8px; color: #854d0e;">Ready</div>
                    </div>
                </div>

                <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${data.dashboardUrl}" 
                       style="display: inline-block; 
                              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                              color: #ffffff;
                              text-decoration: none;
                              padding: 14px 36px;
                              border-radius: 50px;
                              font-weight: 600;
                              font-size: 16px;
                              margin-right: 12px;
                              box-shadow: 0 4px 12px rgba(59,130,246,0.3);">
                        Go to Dashboard →
                    </a>
                </div>

                <div style="background: linear-gradient(135deg, #eff6ff, #f8fafc); border-radius: 16px; padding: 24px;">
                    <h3 style="margin: 0 0 16px; font-size: 16px; color: #1f2937;">🚀 Quick Start Guide</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 2;">
                        <li>Complete your company profile</li>
                        <li>Customize your brand colors</li>
                        <li>Invite team members</li>
                        <li>Explore features and integrations</li>
                    </ul>
                    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-size: 13px; color: #3b82f6;">
                            📞 Need help? Contact us at <a href="mailto:${data.supportEmail}" style="color: #3b82f6;">${data.supportEmail}</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
}