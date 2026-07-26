import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email: string, otp: string) => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || '"Navodaya Trendz" <noreply@navodaya.com>';

  const subject = 'Verify your email - Navodaya Trendz';
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 20px;">
        <h2 style="color: #000000; margin: 0; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Navodaya Trendz</h2>
      </div>
      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hello,</p>
      <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">Thank you for registering. Please use the following One-Time Password (OTP) to complete your manual verification. This code is valid for <strong>5 minutes</strong>.</p>
      <div style="text-align: center; margin: 32px 0;">
        <span style="display: inline-block; font-size: 36px; font-weight: 800; color: #000000; letter-spacing: 6px; padding: 12px 30px; border: 2px solid #000000; border-radius: 8px; background-color: #f9f9f9; font-family: monospace;">${otp}</span>
      </div>
      <p style="color: #777777; font-size: 13px; line-height: 1.6; margin-top: 32px; border-top: 1px solid #eeeeee; padding-top: 16px;">If you did not request this registration, please ignore this email.</p>
    </div>
  `;

  // Check if SMTP is configured
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });

      await transporter.sendMail({
        from,
        to: email,
        subject,
        html: htmlContent,
      });

      console.log(`[EMAIL] OTP sent to ${email} via SMTP.`);
      return true;
    } catch (error) {
      console.error('[EMAIL] Failed to send email via SMTP, falling back to console:', error);
    }
  }

  // Fallback / local development: log to terminal
  console.log('\n┌────────────────────────────────────────────────────────┐');
  console.log(`│  [LOCAL DEV] OTP generated for email: ${email.padEnd(17)} │`);
  console.log(`│  OTP CODE: ${otp}                                         │`);
  console.log('└────────────────────────────────────────────────────────┘\n');
  return true;
};
