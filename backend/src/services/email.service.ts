// services/email.service.ts
import nodemailer from 'nodemailer';
import "dotenv/config";

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER!,
        pass: process.env.GMAIL_PASS!
    }
});

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export class EmailService {
    private static instance: EmailService;

    private constructor() {}

    public static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            const mailOptions = {
                from: options.from || `${process.env.APP_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent: ${info.messageId}`);
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error('Failed to send email');
        }
    }
}

export const emailService = EmailService.getInstance();