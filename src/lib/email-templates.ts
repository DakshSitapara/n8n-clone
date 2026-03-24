export const resetPasswordTemplate = (url: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your password</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
            
            <!-- Header -->
            <tr>
              <td style="background:#000000;padding:32px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:-0.3px;">
                  N8N Clone
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 32px;">
                <h2 style="margin:0 0 8px;color:#09090b;font-size:20px;font-weight:600;">
                  Reset your password
                </h2>
                <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.6;">
                  We received a request to reset the password for your account.
                  Click the button below to choose a new password.
                  This link will expire in <strong style="color:#09090b;">1 hour</strong>.
                </p>n8n-clone-nu.vercel.app

                <!-- Button -->
                <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="border-radius:8px;background:#000000;">
                      <a href="${url}"
                        style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:500;text-decoration:none;border-radius:8px;">
                        Reset password
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Divider -->
                <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />

                <!-- Fallback URL -->
                <p style="margin:0 0 8px;color:#71717a;font-size:13px;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin:0;word-break:break-all;">
                  <a href="${url}" style="color:#000000;font-size:13px;">${url}</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f4f4f5;padding:24px 32px;border-top:1px solid #e4e4e7;">
                <p style="margin:0;color:#a1a1aa;font-size:12px;line-height:1.6;text-align:center;">
                  If you didn't request a password reset, you can safely ignore this email.
                  Your password will not be changed.
                  <br/>
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
`;

export const verificationEmailTemplate = (url: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
            
            <!-- Header -->
            <tr>
              <td style="background:#000000;padding:32px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:-0.3px;">
                  N8N Clone
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 32px;">
                <h2 style="margin:0 0 8px;color:#09090b;font-size:20px;font-weight:600;">
                  Verify your email address
                </h2>
                <p style="margin:0 0 24px;color:#71717a;font-size:15px;line-height:1.6;">
                  Thanks for signing up! Click the button below to verify your
                  email address and activate your account.
                  This link will expire in <strong style="color:#09090b;">1 hour</strong>.
                </p>

                <!-- Button -->
                <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="border-radius:8px;background:#000000;">
                      <a href="${url}"
                        style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:500;text-decoration:none;border-radius:8px;">
                        Verify email
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Divider -->
                <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />

                <!-- Fallback URL -->
                <p style="margin:0 0 8px;color:#71717a;font-size:13px;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin:0;word-break:break-all;">
                  <a href="${url}" style="color:#000000;font-size:13px;">${url}</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f4f4f5;padding:24px 32px;border-top:1px solid #e4e4e7;">
                <p style="margin:0;color:#a1a1aa;font-size:12px;line-height:1.6;text-align:center;">
                  If you didn't create an account, you can safely ignore this email.
                  <br/>
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
`;
