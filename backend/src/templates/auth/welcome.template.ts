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
                    <div style="font-size: 48px;">🎉</div>
                </div>
                
                <h2 style="margin: 0 0 16px; font-size: 24px; color: #1f2937; text-align: center;">
                    Welcome ${data.userName}! 👋
                </h2>
                
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                    Your email has been successfully verified. You're now ready to start managing 
                    <strong>${data.companyName}</strong> with our platform.
                </p>

                <!-- Quick Stats -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
                    <div style="text-align: center; padding: 16px; background: #f0fdf4; border-radius: 12px;">
                        <div style="font-size: 28px;">✅</div>
                        <div style="font-size: 13px; font-weight: 600; margin-top: 8px;">Email Verified</div>
                    </div>
                    <div style="text-align: center; padding: 16px; background: #eff6ff; border-radius: 12px;">
                        <div style="font-size: 28px;">🏢</div>
                        <div style="font-size: 13px; font-weight: 600; margin-top: 8px;">Company Active</div>
                    </div>
                    <div style="text-align: center; padding: 16px; background: #fef3c7; border-radius: 12px;">
                        <div style="font-size: 28px;">🚀</div>
                        <div style="font-size: 13px; font-weight: 600; margin-top: 8px;">Ready to Start</div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${data.dashboardUrl}" 
                       style="display: inline-block; 
                              background: linear-gradient(135deg, #6366f1, #8b5cf6);
                              color: #ffffff;
                              text-decoration: none;
                              padding: 14px 32px;
                              border-radius: 8px;
                              font-weight: 600;
                              font-size: 16px;
                              margin-right: 12px;">
                        Go to Dashboard →
                    </a>
                </div>

                <!-- Getting Started -->
                <div style="margin-bottom: 32px;">
                    <h3 style="margin: 0 0 12px; font-size: 16px; color: #1f2937;">
                        🚀 Getting Started
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                        <li>Complete your company profile</li>
                        <li>Set up your team members</li>
                        <li>Configure your communication channels</li>
                        <li>Explore our features and integrations</li>
                    </ul>
                </div>

                <!-- Support Section -->
                <div style="background: #eff6ff; border-radius: 12px; padding: 20px;">
                    <div style="text-align: center;">
                        <strong style="color: #1e40af; font-size: 14px;">📞 Need Help Getting Started?</strong>
                        <p style="margin: 8px 0 0; font-size: 13px; color: #3b82f6;">
                            Our support team is here to help! Contact us at 
                            <a href="mailto:${data.supportEmail}" style="color: #2563eb;">${data.supportEmail}</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
}