import nodemailer from 'nodemailer';

// Create a reusable SMTP transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,    // your Gmail address
    pass: process.env.SMTP_PASSWORD  // Gmail App Password (NOT your regular password)
  }
});

/**
 * Send a booking notification email to the photographer/creator
 */
export async function sendBookingNotification({ photographerEmail, photographerName, clientName, clientEmail, clientPhone, bookingTitle, bookingDate, bookingTime, bookingPrice, bookingType }) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn('⚠️  SMTP credentials not configured — skipping email notification.');
    return { sent: false, reason: 'SMTP not configured' };
  }

  if (!photographerEmail) {
    console.warn('⚠️  No photographer email found — skipping email notification.');
    return { sent: false, reason: 'No photographer email' };
  }

  const formattedPrice = typeof bookingPrice === 'number'
    ? `₹${bookingPrice.toLocaleString('en-IN')}`
    : bookingPrice;

  const mailOptions = {
    from: `"PickMyShoot" <${process.env.SMTP_EMAIL}>`,
    to: photographerEmail,
    subject: `🎯 New Booking Request — ${bookingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background:#f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7; padding: 32px 0;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #C8102E 0%, #FF4D5A 100%); padding: 28px 32px; text-align: center;">
                    <h1 style="color:#fff; margin:0; font-size:22px; font-weight:800; letter-spacing:-0.5px;">
                      📸 PickMyShoot
                    </h1>
                    <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:13px;">
                      New Booking Notification
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 28px 32px;">
                    <p style="font-size:15px; color:#333; margin:0 0 18px; line-height:1.6;">
                      Hi <strong>${photographerName || 'Creator'}</strong>,<br><br>
                      Great news! You have a new <strong>${bookingType || 'booking'}</strong> request on PickMyShoot. Here are the details:
                    </p>

                    <!-- Booking Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fb; border:1px solid #e8eaed; border-radius:12px; overflow:hidden; margin-bottom:20px;">
                      <tr>
                        <td style="padding: 20px 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding:6px 0; font-size:13px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Booking</td>
                              <td style="padding:6px 0; font-size:14px; color:#222; font-weight:700; text-align:right;">${bookingTitle}</td>
                            </tr>
                            <tr>
                              <td colspan="2" style="border-bottom:1px solid #e8eaed; padding:0; height:1px;"></td>
                            </tr>
                            <tr>
                              <td style="padding:6px 0; font-size:13px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Date</td>
                              <td style="padding:6px 0; font-size:14px; color:#222; font-weight:600; text-align:right;">${bookingDate || 'To be confirmed'}</td>
                            </tr>
                            <tr>
                              <td colspan="2" style="border-bottom:1px solid #e8eaed; padding:0; height:1px;"></td>
                            </tr>
                            <tr>
                              <td style="padding:6px 0; font-size:13px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Time</td>
                              <td style="padding:6px 0; font-size:14px; color:#222; font-weight:600; text-align:right;">${bookingTime || 'To be confirmed'}</td>
                            </tr>
                            <tr>
                              <td colspan="2" style="border-bottom:1px solid #e8eaed; padding:0; height:1px;"></td>
                            </tr>
                            <tr>
                              <td style="padding:6px 0; font-size:13px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Amount</td>
                              <td style="padding:6px 0; font-size:15px; color:#C8102E; font-weight:800; text-align:right;">${formattedPrice}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Client Info -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef7f7; border:1px solid #fde2e2; border-radius:12px; overflow:hidden; margin-bottom:20px;">
                      <tr>
                        <td style="padding: 16px 24px;">
                          <p style="margin:0 0 8px; font-size:12px; color:#888; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Client Details</p>
                          <p style="margin:0; font-size:14px; color:#333; line-height:1.7;">
                            <strong>Name:</strong> ${clientName || 'N/A'}<br>
                            <strong>Email:</strong> ${clientEmail || 'N/A'}<br>
                            <strong>Phone:</strong> ${clientPhone || 'N/A'}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="font-size:13px; color:#666; margin:0 0 20px; line-height:1.5;">
                      Please log in to your PickMyShoot dashboard to accept or manage this booking. The client is waiting for your confirmation!
                    </p>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${process.env.APP_URL || 'http://localhost:5173'}/dashboard/photographer" 
                             style="display:inline-block; background:linear-gradient(135deg, #C8102E, #FF4D5A); color:#fff; text-decoration:none; padding:13px 36px; border-radius:10px; font-size:14px; font-weight:700; letter-spacing:0.3px;">
                            View Booking →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 32px; background:#f8f9fb; border-top:1px solid #e8eaed; text-align:center;">
                    <p style="font-size:11px; color:#aaa; margin:0; line-height:1.6;">
                      This is an automated notification from PickMyShoot.<br>
                      © ${new Date().getFullYear()} PickMyShoot — Every Story Builds a Brand.
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
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${photographerEmail}: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return { sent: false, reason: error.message };
  }
}

/**
 * Send a verification code notification email to the photographer/creator
 */
export async function sendVerificationCodeEmail({ photographerEmail, photographerName, code }) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn('⚠️  SMTP credentials not configured — skipping verification email.');
    return { sent: false, reason: 'SMTP not configured' };
  }

  if (!photographerEmail) {
    console.warn('⚠️  No photographer email found — skipping verification email.');
    return { sent: false, reason: 'No photographer email' };
  }

  const mailOptions = {
    from: `"PickMyShoot" <${process.env.SMTP_EMAIL}>`,
    to: photographerEmail,
    subject: `🔑 Your PickMyShoot Partner Verification Code: ${code}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background:#f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7; padding: 32px 0;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #C8102E 0%, #FF4D5A 100%); padding: 28px 32px; text-align: center;">
                    <h1 style="color:#fff; margin:0; font-size:22px; font-weight:800; letter-spacing:-0.5px;">
                      📸 PickMyShoot
                    </h1>
                    <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:13px;">
                      Partner Verification System
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 28px 32px;">
                    <p style="font-size:15px; color:#333; margin:0 0 18px; line-height:1.6;">
                      Hi <strong>${photographerName || 'Creator'}</strong>,<br><br>
                      An administrator has generated a new partner verification code for your PickMyShoot profile. Please use this code to verify your profile status.
                    </p>

                    <div style="background:#f8f9fb; border:1px solid #e8eaed; border-radius:12px; padding: 24px; text-align: center; margin: 24px 0;">
                      <span style="font-size: 13px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Your Verification Code</span>
                      <strong style="font-size: 32px; color: #C8102E; font-weight: 800; letter-spacing: 2px;">${code}</strong>
                    </div>

                    <p style="font-size:13px; color:#666; margin:0 0 20px; line-height:1.5;">
                      If you did not request this verification code, please ignore this email or contact support.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 32px; background:#f8f9fb; border-top:1px solid #e8eaed; text-align:center;">
                    <p style="font-size:11px; color:#aaa; margin:0; line-height:1.6;">
                      This is an automated verification email from PickMyShoot.<br>
                      © ${new Date().getFullYear()} PickMyShoot — Every Story Builds a Brand.
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
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Verification email sent to ${photographerEmail}: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
    return { sent: false, reason: error.message };
  }
}

