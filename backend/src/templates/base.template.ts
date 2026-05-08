// templates/base.template.ts
export interface BaseTemplateConfig {
    appName: string;
    appColor: string;
    accentColor: string;
    fontFamily?: string;
    companyLogo?: string;
    companyAddress?: string;
}

export interface CompanyBranding {
    companyName: string;
    companyLogo?: string;
    companyAddress?: string;
    primaryColor?: string;
    accentColor?: string;
}

export class BaseEmailTemplate {
    protected config: BaseTemplateConfig;

    constructor(config: BaseTemplateConfig) {
        this.config = {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            ...config
        };
    }

    formatCurrency(amount: number): string {
        return `£${amount.toFixed(2)}`;
    }

    formatDate(date: Date | string): string {
        const d = new Date(date);
        return d.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    wrapContent(content: string, options?: {
        preheader?: string;
        title?: string;
        branding?: CompanyBranding;
    }): string {
        const branding = options?.branding;
        const primaryColor = branding?.primaryColor || this.config.appColor;
        const accentColor = branding?.accentColor || this.config.accentColor;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${options?.title || this.config.appName}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#f4f5f7; font-family:${this.config.fontFamily}; -webkit-font-smoothing:antialiased;">
  
  ${options?.preheader ? `
  <div style="display:none; font-size:1px; color:#f4f5f7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    ${options.preheader}
  </div>
  ` : ''}

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 16px rgba(0,0,0,0.05);">

          <!-- Company Header with Dynamic Logo -->
          <div style="background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%); padding: 48px 40px; text-align: center;">
            ${branding?.companyLogo ? `
              <img src="${branding.companyLogo}" alt="${branding.companyName}" style="max-width: 180px; margin-bottom: 24px; border-radius: 8px;">
            ` : ''}
            <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 700;">
              ${branding?.companyName || this.config.appName}
            </h1>
            ${branding?.companyName ? `
              <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">
                Powered by ${this.config.appName}
              </p>
            ` : ''}
          </div>

          ${content}

          <!-- Company-Specific Footer -->
          <div style="padding: 32px 40px; background: #f8fafc; border-top: 1px solid #e5e7eb;">
            <table width="100%">
              <tr>
                <td style="text-align: center;">
                  ${branding?.companyLogo ? `
                    <img src="${branding.companyLogo}" alt="${branding.companyName}" style="max-width: 100px; margin-bottom: 16px; opacity: 0.7;">
                  ` : ''}
                  <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #1f2937;">
                    ${branding?.companyName || this.config.appName}
                  </p>
                  ${branding?.companyAddress ? `
                    <p style="margin: 0 0 16px; font-size: 12px; color: #6b7280;">
                      ${branding.companyAddress}
                    </p>
                  ` : ''}
                  <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                    This is an automated message from ${this.config.appName}. Please do not reply to this email.
                  </p>
                  <p style="margin: 16px 0 0; font-size: 11px; color: #9ca3af;">
                    © ${new Date().getFullYear()} ${branding?.companyName || this.config.appName}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </div>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }

    getSeverityConfig(severity: string) {
        const configs = {
            critical: {
                color: '#dc2626',
                bg: '#fee2e2',
                border: '#fecaca',
                label: 'CRITICAL — Below Safety Stock',
                icon: '🚨'
            },
            warning: {
                color: '#ea580c',
                bg: '#fff7ed',
                border: '#fed7aa',
                label: 'Reorder Required',
                icon: '⚠️'
            },
            low: {
                color: '#d97706',
                bg: '#fffbeb',
                border: '#fde68a',
                label: 'Stock Running Low',
                icon: '📉'
            }
        };
        return configs[severity as keyof typeof configs] || configs.low;
    }
}