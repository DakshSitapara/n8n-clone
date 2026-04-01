export const resetPasswordTemplate = (url: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <img src="https://raw.githubusercontent.com/DakshSitapara/n8n-clone/refs/heads/main/public/logos/logo.svg" alt="N8N Clone Logo" width="48" height="48" style="display:block;" draggable="false" />
              <h1 style="margin:16px 0 0;color:#1e293b;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                N8N Clone
              </h1>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:40px 32px;text-align:center;">
                  <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15V17M12 9V13M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h2 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:-0.3px;">
                    Reset Your Password
                  </h2>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 32px;">
                  <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
                    We received a request to reset the password for your account. If you made this request, click the button below to create a new password.
                  </p>
                  <p style="margin:0 0 32px;color:#64748b;font-size:14px;line-height:1.6;">
                    This link will expire in <strong style="color:#6366f1;">1 hour</strong> for your security.
                  </p>

                  <!-- Button -->
                  <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                    <tr>
                      <td>
                        <a href="${url}"
                          style="display:inline-block;padding:16px 32px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;box-shadow:0 4px 6px -1px rgba(99,102,241,0.3);">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Divider -->
                  <div style="border-top:1px solid #e2e8f0;margin:24px 0 20px;"></div>

                  <!-- Fallback URL -->
                  <p style="margin:0 0 8px;color:#64748b;font-size:13px;">
                    If the button doesn't work, copy and paste this link:
                  </p>
                  <p style="margin:0;padding:12px;background:#f1f5f9;border-radius:8px;font-size:12px;color:#475569;word-break:break-all;">
                    ${url}
                  </p>
                </td>
              </tr>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0;text-align:center;">
              <p style="margin:0 0 12px;color:#64748b;font-size:13px;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email. Your password won't be changed.
              </p>
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} N8N Clone. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export const verificationEmailTemplate = (url: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <img src="https://raw.githubusercontent.com/DakshSitapara/n8n-clone/refs/heads/main/public/logos/logo.svg" alt="N8N Clone Logo" width="48" height="48" style="display:block;" draggable="false" />
              <h1 style="margin:16px 0 0;color:#1e293b;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                N8N Clone
              </h1>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 32px;text-align:center;">
                  <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h2 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:-0.3px;">
                    Verify Your Email
                  </h2>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 32px;">
                  <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
                    Welcome to N8N Clone! We're excited to have you on board. Please verify your email address to activate your account and get started.
                  </p>
                  <p style="margin:0 0 32px;color:#64748b;font-size:14px;line-height:1.6;">
                    This verification link will expire in <strong style="color:#10b981;">1 hour</strong> for your security.
                  </p>

                  <!-- Button -->
                  <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                    <tr>
                      <td>
                        <a href="${url}"
                          style="display:inline-block;padding:16px 32px;background:linear-gradient(135deg,#10b981 0%,#059669 100%);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;box-shadow:0 4px 6px -1px rgba(16,185,129,0.3);">
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Divider -->
                  <div style="border-top:1px solid #e2e8f0;margin:24px 0 20px;"></div>

                  <!-- Fallback URL -->
                  <p style="margin:0 0 8px;color:#64748b;font-size:13px;">
                    If the button doesn't work, copy and paste this link:
                  </p>
                  <p style="margin:0;padding:12px;background:#f1f5f9;border-radius:8px;font-size:12px;color:#475569;word-break:break-all;">
                    ${url}
                  </p>
                </td>
              </tr>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0;text-align:center;">
              <p style="margin:0 0 12px;color:#64748b;font-size:13px;line-height:1.6;">
                If you didn't create an account with N8N Clone, you can safely ignore this email.
              </p>
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} N8N Clone. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
