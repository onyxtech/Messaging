import { transporator } from "../config/node.mailer.config";
import { BaseEmailTemplate } from "../templates/base.template";
import "dotenv/config";

export interface EmailRecipient {
    email: string;
    name?: string;
    type: 'to' | 'cc' | 'bcc';
}

export interface EmailOptions {
    from?: string;
    to: string | EmailRecipient[];
    cc?: string | EmailRecipient[];
    bcc?: string | EmailRecipient[];
    subject: string;
    html: string;
    text?: string;
    attachments?: Array<{
        filename: string;
        content: Buffer | string;
        contentType?: string;
    }>;
}

// NEW: Interface for company branding
export interface CompanyBranding {
    companyName: string;
    companyLogo?: string;
    companyAddress?: string;
    primaryColor?: string;
    accentColor?: string;
}

export class EmailService {
    private static instance: EmailService;
    private baseTemplate: BaseEmailTemplate;

    private constructor() {
        this.baseTemplate = new BaseEmailTemplate({
            appName: process.env.APP_NAME || 'Inventory Pro',
            appColor: process.env.BRAND_COLOR || '#0f172a',
            accentColor: process.env.ACCENT_COLOR || '#6366f1',
            companyLogo: process.env.COMPANY_LOGO, // Default system logo
            companyAddress: process.env.COMPANY_ADDRESS
        });
    }

    public static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    private formatRecipients(recipients: string | EmailRecipient[]): string[] {
        if (typeof recipients === 'string') {
            return [recipients];
        }
        return recipients.map(r => r.email);
    }

    private async sendMail(options: EmailOptions): Promise<void> {
        try {
            const mailOptions: any = {
                from: options.from || `${process.env.APP_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
                to: this.formatRecipients(options.to).join(', '),
                subject: options.subject,
                html: options.html,
                text: options.text
            };

            if (options.cc) {
                mailOptions.cc = this.formatRecipients(options.cc).join(', ');
            }

            if (options.bcc) {
                mailOptions.bcc = this.formatRecipients(options.bcc).join(', ');
            }

            if (options.attachments) {
                mailOptions.attachments = options.attachments;
            }

            const info = await transporator.sendMail(mailOptions);
            console.log(`Email sent successfully: ${info.messageId}`);

            await this.logEmailDelivery({
                messageId: info.messageId,
                to: mailOptions.to,
                subject: mailOptions.subject,
                timestamp: new Date()
            });

        } catch (error: any) {
            console.error('Failed to send email:', error);
            throw new Error(`Email delivery failed: ${error.message}`);
        }
    }

    // NEW: Send email with company branding
    public async sendCompanyEmail(
        to: string, 
        subject: string, 
        htmlContent: string, 
        branding: CompanyBranding
    ): Promise<void> {
        const fullHtml = this.baseTemplate.wrapContent(htmlContent, {
            preheader: subject,
            title: subject,
            branding: branding // Pass branding to template
        });

        await this.sendMail({
            to: to,
            subject: subject,
            html: fullHtml
        });
    }

    private async logEmailDelivery(log: any): Promise<void> {
        // TODO: Implement email logging to database
    }
}

export const emailService = EmailService.getInstance();