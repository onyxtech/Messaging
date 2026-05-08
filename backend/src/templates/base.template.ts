// templates/base.template.ts
export interface BaseTemplateConfig {
    appName: string;
    appColor: string;
    accentColor: string;
    fontFamily?: string;
}

export interface CompanyBranding {
    companyName: string;
    companyLogo?: string;
    companyAddress?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    companyEmail?: string;
    supportEmail?: string;
}

export class BaseEmailTemplate {
    protected config: BaseTemplateConfig;

    constructor(config: BaseTemplateConfig) {
        this.config = {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            ...config
        };
    }

    wrapContent(content: string, options?: {
        preheader?: string;
        title?: string;
        branding?: CompanyBranding;
    }): string {
        const branding = options?.branding;
        const primaryColor = branding?.primaryColor || this.config.appColor;
        const secondaryColor = branding?.secondaryColor || '#3b82f6';
        const accentColor = branding?.accentColor || this.config.accentColor;
        
        // Create gradient based on company colors
        const gradientStyle = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options?.title || branding?.companyName || this.config.appName}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      .gradient-bg { padding: 32px 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#f4f5f7; font-family:${this.config.fontFamily};">
  
  ${options?.preheader ? `
  <div style="display:none; font-size:1px; color:#f4f5f7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    ${options.preheader}
  </div>
  ` : ''}

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.1);">

          <!-- Gradient Header -->
          <div class="gradient-bg" style="background: ${gradientStyle}; padding: 48px 40px; text-align: center;">
            ${branding?.companyLogo ? `
              <img src="${branding.companyLogo}" alt="${branding.companyName}" style="max-width: 160px; margin-bottom: 24px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15);">
            ` : ''}
            <h1 style="margin: 0; font-size: 32px; color: #ffffff; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ${branding?.companyName || this.config.appName}
            </h1>
            ${branding?.companyName ? `
              <p style="margin: 12px 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">
                Powered by ${this.config.appName}
              </p>
            ` : ''}
          </div>

          ${content}

          <!-- Company Footer -->
          <div style="padding: 32px 40px; background: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
            ${branding?.companyLogo ? `
              <img src="${branding.companyLogo}" alt="${branding.companyName}" style="max-width: 80px; margin-bottom: 16px; opacity: 0.6;">
            ` : ''}
            <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1f2937;">
              ${branding?.companyName || this.config.appName}
            </p>
            ${branding?.companyAddress ? `
              <p style="margin: 0 0 16px; font-size: 12px; color: #6b7280;">
                ${branding.companyAddress}
              </p>
            ` : ''}
            ${branding?.companyEmail ? `
              <p style="margin: 0 0 8px; font-size: 12px; color: #6b7280;">
                📧 ${branding.companyEmail}
              </p>
            ` : ''}
            <p style="margin: 16px 0 0; font-size: 11px; color: #9ca3af;">
              © ${new Date().getFullYear()} ${branding?.companyName || this.config.appName}. All rights reserved.
            </p>
            <p style="margin: 8px 0 0; font-size: 11px; color: #9ca3af;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>

        </table>
      </table>
    </tr>
  </table>
</body>
</html>`;
    }
}