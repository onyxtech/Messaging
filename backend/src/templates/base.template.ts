// templates/base.template.ts
export interface BaseTemplateConfig {
  appName:     string;
  appColor:    string;
  accentColor: string;
  fontFamily?: string;
}

export interface CompanyBranding {
  companyName:    string;
  companyLogo?:   string;   // must be a full public URL e.g. https://domain.com/uploads/logos/x.png
  companyAddress?: string;
  primaryColor?:  string;
  secondaryColor?: string;
  accentColor?:   string;
  companyEmail?:  string;
  supportEmail?:  string;
}

export class BaseEmailTemplate {
  protected config: BaseTemplateConfig;

  constructor(config: BaseTemplateConfig) {
    this.config = {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      ...config,
    };
  }

  wrapContent(
    content: string,
    options?: {
      preheader?: string;
      title?:     string;
      branding?:  CompanyBranding;
    },
  ): string {
    const branding       = options?.branding;
    const primaryColor   = branding?.primaryColor   || this.config.appColor;
    const secondaryColor = branding?.secondaryColor || "#3b82f6";
    const accentColor    = branding?.accentColor    || this.config.accentColor;
    const gradient       = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`;
    const displayName    = branding?.companyName || this.config.appName;

    console.log("branding", branding);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options?.title || displayName}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .outer-table  { padding: 16px 8px !important; }
      .card-table   { width: 100% !important; border-radius: 16px !important; }
      .header-cell  { padding: 32px 20px !important; }
      .content-cell { padding: 24px 20px !important; }
      .footer-cell  { padding: 24px 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#f4f5f7; font-family:${this.config.fontFamily};">

  ${options?.preheader ? `
  <div style="display:none; font-size:1px; color:#f4f5f7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    ${options.preheader}
  </div>` : ""}

  <!-- Outer wrapper -->
  <table class="outer-table" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#f4f5f7; padding:40px 20px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table class="card-table" width="640" cellpadding="0" cellspacing="0" border="0"
          style="background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.10);">

          <!-- ═══ GRADIENT HEADER ═══════════════════════════════════════════ -->
          <tr>
            <td class="header-cell" align="center"
              style="background:${gradient}; padding:48px 40px;">

              ${branding?.companyLogo ? `
              <img
                src="${branding.companyLogo}"
                alt="${displayName}"
                width="160"
                style="max-width:160px; height:auto; display:block; margin:0 auto 24px; border-radius:12px; box-shadow:0 8px 16px rgba(0,0,0,0.15);"
              />` : ""}

              <h1 style="margin:0; font-size:28px; color:#ffffff; font-weight:700; line-height:1.2; text-shadow:0 2px 4px rgba(0,0,0,0.10);">
                ${displayName}
              </h1>

              ${branding?.companyName ? `
              <p style="margin:10px 0 0; font-size:13px; color:rgba(255,255,255,0.85);">
                Powered by ${this.config.appName}
              </p>` : ""}

            </td>
          </tr>

          <!-- ═══ MAIN CONTENT (injected) ══════════════════════════════════ -->
          <tr>
            <td class="content-cell" style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- ═══ FOOTER ════════════════════════════════════════════════════ -->
          <tr>
            <td class="footer-cell" align="center"
              style="padding:28px 40px 36px; background:#f8fafc; border-top:1px solid #e5e7eb;">

              ${branding?.companyLogo ? `
              <img
                src="${branding.companyLogo}"
                alt="${displayName}"
                width="80"
                style="max-width:80px; height:auto; display:block; margin:0 auto 14px; opacity:0.55;"
              />` : ""}

              <p style="margin:0 0 4px; font-size:15px; font-weight:600; color:#1f2937;">
                ${displayName}
              </p>

              ${branding?.companyAddress ? `
              <p style="margin:0 0 6px; font-size:12px; color:#6b7280;">
                ${branding.companyAddress}
              </p>` : ""}

              ${branding?.companyEmail ? `
              <p style="margin:0 0 14px; font-size:12px; color:#6b7280;">
                📧 ${branding.companyEmail}
              </p>` : ""}

              <p style="margin:14px 0 0; font-size:11px; color:#9ca3af;">
                © ${new Date().getFullYear()} ${displayName}. All rights reserved.
              </p>
              <p style="margin:6px 0 0; font-size:11px; color:#9ca3af;">
                This is an automated message — please do not reply to this email.
              </p>

            </td>
          </tr>

        </table>
        <!-- /card -->

      </td>
    </tr>
  </table>
  <!-- /outer wrapper -->

</body>
</html>`;
  }
}