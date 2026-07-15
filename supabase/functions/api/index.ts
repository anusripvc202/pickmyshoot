import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import postgres from "npm:postgres";
import nodemailer from "npm:nodemailer";

const smtpEmail = Deno.env.get('SMTP_EMAIL') || 'anusripvc202@gmail.com';
const smtpPassword = Deno.env.get('SMTP_PASSWORD') || 'mrzplpjgedrqljrx';
const appUrl = Deno.env.get('APP_URL') || 'http://localhost:5173';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: smtpEmail,
    pass: smtpPassword
  }
});

/**
 * Send a booking notification email to the photographer/creator
 */
async function sendBookingNotification({ photographerEmail, photographerName, clientName, clientEmail, clientPhone, bookingTitle, bookingDate, bookingTime, bookingPrice, bookingType }) {
  if (!smtpEmail || !smtpPassword) {
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
    from: `"PickMyShoot" <${smtpEmail}>`,
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
                          <a href="${appUrl}/dashboard/photographer" 
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
 * Send a booking confirmation email to the client
 */
async function sendClientBookingConfirmation({ clientEmail, clientName, bookingTitle, bookingDate, bookingTime, bookingPrice, bookingType, photographerName }) {
  if (!smtpEmail || !smtpPassword) {
    console.warn('⚠️  SMTP credentials not configured — skipping client email notification.');
    return { sent: false, reason: 'SMTP not configured' };
  }

  if (!clientEmail) {
    console.warn('⚠️  No client email found — skipping client email notification.');
    return { sent: false, reason: 'No client email' };
  }

  const formattedPrice = typeof bookingPrice === 'number'
    ? `₹${bookingPrice.toLocaleString('en-IN')}`
    : bookingPrice;

  const mailOptions = {
    from: `"PickMyShoot" <${smtpEmail}>`,
    to: clientEmail,
    subject: `🎉 Booking Confirmed — ${bookingTitle}`,
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
                  <td style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 28px 32px; text-align: center;">
                    <h1 style="color:#fff; margin:0; font-size:22px; font-weight:800; letter-spacing:-0.5px;">
                      📸 PickMyShoot
                    </h1>
                    <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:13px;">
                      Booking Confirmation
                    </p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding: 28px 32px;">
                    <p style="font-size:15px; color:#333; margin:0 0 18px; line-height:1.6;">
                      Hi <strong>${clientName || 'Valued Customer'}</strong>,<br><br>
                      Thank you for choosing PickMyShoot! Your booking has been successfully placed. We've sent a notification to the photographer/provider <strong>${photographerName || 'Creator'}</strong>. Here are your booking details:
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
                              <td style="padding:6px 0; font-size:13px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Provider</td>
                              <td style="padding:6px 0; font-size:14px; color:#222; font-weight:600; text-align:right;">${photographerName}</td>
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
                              <td style="padding:6px 0; font-size:13px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Amount Paid/Due</td>
                              <td style="padding:6px 0; font-size:15px; color:#2B6CB0; font-weight:800; text-align:right;">${formattedPrice}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <p style="font-size:13px; color:#666; margin:0 0 20px; line-height:1.5;">
                      You can log in to your dashboard at any time to view, track, or manage your bookings.
                    </p>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${appUrl}/dashboard/client" 
                             style="display:inline-block; background:linear-gradient(135deg, #1E3A8A, #3B82F6); color:#fff; text-decoration:none; padding:13px 36px; border-radius:10px; font-size:14px; font-weight:700; letter-spacing:0.3px;">
                            Go to Dashboard
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
                      This is an automated confirmation from PickMyShoot.<br>
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
    console.log(`📧 Client confirmation email sent to ${clientEmail}: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send client email:', error.message);
    return { sent: false, reason: error.message };
  }
}

/**
 * Send a verification code notification email to the photographer/creator
 */
async function sendVerificationCodeEmail({ photographerEmail, photographerName, code }) {
  if (!smtpEmail || !smtpPassword) {
    console.warn('⚠️  SMTP credentials not configured — skipping verification email.');
    return { sent: false, reason: 'SMTP not configured' };
  }

  if (!photographerEmail) {
    console.warn('⚠️  No photographer email found — skipping verification email.');
    return { sent: false, reason: 'No photographer email' };
  }

  const mailOptions = {
    from: `"PickMyShoot" <${smtpEmail}>`,
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

/**
 * Send contact form email to the admin/support team
 */
async function sendContactFormEmail({ name, email, subject, message }) {
  if (!smtpEmail || !smtpPassword) {
    console.warn('⚠️  SMTP credentials not configured — skipping contact form email.');
    return { sent: false, reason: 'SMTP not configured' };
  }

  const mailOptions = {
    from: `"PickMyShoot Contact" <${smtpEmail}>`,
    to: smtpEmail,
    replyTo: email,
    subject: `📞 New Contact Us Inquiry: ${subject}`,
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
                  <td style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 28px 32px; text-align: center;">
                    <h1 style="color:#fff; margin:0; font-size:22px; font-weight:800; letter-spacing:-0.5px;">
                      📸 PickMyShoot
                    </h1>
                    <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:13px;">
                      New Contact Inquiry
                    </p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding: 28px 32px;">
                    <p style="font-size:15px; color:#333; margin:0 0 18px; line-height:1.6;">
                      You have received a new message from the Contact Us form on PickMyShoot.
                    </p>

                    <!-- Submission Details -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fb; border:1px solid #e8eaed; border-radius:12px; overflow:hidden; margin-bottom:20px;">
                      <tr>
                        <td style="padding: 20px 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding:6px 0; font-size:13px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Name</td>
                              <td style="padding:6px 0; font-size:14px; color:#222; font-weight:700; text-align:right;">${name}</td>
                            </tr>
                            <tr>
                              <td colspan="2" style="border-bottom:1px solid #e8eaed; padding:0; height:1px;"></td>
                            </tr>
                            <tr>
                              <td style="padding:6px 0; font-size:13px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Email</td>
                              <td style="padding:6px 0; font-size:14px; color:#222; font-weight:600; text-align:right;">
                                <a href="mailto:${email}" style="color:#3B82F6; text-decoration:none;">${email}</a>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2" style="border-bottom:1px solid #e8eaed; padding:0; height:1px;"></td>
                            </tr>
                            <tr>
                              <td style="padding:6px 0; font-size:13px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Subject</td>
                              <td style="padding:6px 0; font-size:14px; color:#222; font-weight:600; text-align:right;">${subject}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Message Card -->
                    <div style="background:#fef7f7; border:1px solid #fde2e2; border-radius:12px; padding: 16px 24px; margin-bottom: 20px;">
                      <p style="margin:0 0 8px; font-size:12px; color:#888; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Message</p>
                      <p style="margin:0; font-size:14px; color:#333; line-height:1.7; white-space: pre-wrap;">
                        ${message}
                      </p>
                    </div>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
                             style="display:inline-block; background:linear-gradient(135deg, #1E3A8A, #3B82F6); color:#fff; text-decoration:none; padding:13px 36px; border-radius:10px; font-size:14px; font-weight:700; letter-spacing:0.3px;">
                            Reply to Sender
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
    console.log(`📧 Contact form email sent: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send contact form email:', error.message);
    return { sent: false, reason: error.message };
  }
}

/**
 * Send contact form receipt confirmation to the user
 */
async function sendContactReceiptEmail({ name, email, subject, message }) {
  if (!smtpEmail || !smtpPassword) {
    console.warn('⚠️  SMTP credentials not configured — skipping contact receipt email.');
    return { sent: false, reason: 'SMTP not configured' };
  }

  const mailOptions = {
    from: `"PickMyShoot Support" <${smtpEmail}>`,
    to: email,
    subject: `We've received your message! — PickMyShoot`,
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
                  <td style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 28px 32px; text-align: center;">
                    <h1 style="color:#fff; margin:0; font-size:22px; font-weight:800; letter-spacing:-0.5px;">
                      📸 PickMyShoot
                    </h1>
                    <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:13px;">
                      Message Received
                    </p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding: 28px 32px;">
                    <p style="font-size:15px; color:#333; margin:0 0 18px; line-height:1.6;">
                      Hi <strong>${name}</strong>,<br><br>
                      Thank you for contacting PickMyShoot! We have received your inquiry and our support team will get back to you as soon as possible.
                    </p>

                    <!-- Summary of details -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fb; border:1px solid #e8eaed; border-radius:12px; overflow:hidden; margin-bottom:20px;">
                      <tr>
                        <td style="padding: 20px 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding:6px 0; font-size:13px; color:#888; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Subject</td>
                              <td style="padding:6px 0; font-size:14px; color:#222; font-weight:700; text-align:right;">${subject}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <div style="background:#f9fafb; border:1px solid #e2e8f0; border-radius:12px; padding: 16px 24px; margin-bottom: 20px;">
                      <p style="margin:0 0 8px; font-size:12px; color:#888; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Your Message</p>
                      <p style="margin:0; font-size:14px; color:#555; line-height:1.7; white-space: pre-wrap;">
                        ${message}
                      </p>
                    </div>

                    <p style="font-size:13px; color:#666; margin:0; line-height:1.5;">
                      No reply to this email is necessary. We will be in touch shortly.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 32px; background:#f8f9fb; border-top:1px solid #e8eaed; text-align:center;">
                    <p style="font-size:11px; color:#aaa; margin:0; line-height:1.6;">
                      This is an automated receipt from PickMyShoot.<br>
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
    console.log(`📧 Receipt email sent to ${email}: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send receipt email:', error.message);
    return { sent: false, reason: error.message };
  }
}

const connectionString = Deno.env.get('DATABASE_URL') || 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';
const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Background helper for booking email dispatch
async function edgeSendEmails(booking: any) {
  try {
    // Find creator user
    let [creatorUser] = await sql`
      SELECT * FROM users WHERE "id" = ${booking.creatorId} OR "_id" = ${booking.creatorId}
    `;
    
    // Find client user
    let [clientUser] = await sql`
      SELECT * FROM users WHERE "id" = ${booking.clientId} OR "_id" = ${booking.clientId}
    `;

    let recipientEmail = creatorUser?.email;
    let recipientName = creatorUser?.name;

    // Direct mapping for mock photographer ID used by mock listings
    if (booking.creatorId === '6a380b8173c0e340a6bf3a42') {
      recipientEmail = 'nikhiljai1215@gmail.com';
      recipientName = 'Nikhil photography';
    }

    // Secondary lookup in photographers table if not found in users
    if (!recipientEmail && booking.creatorId) {
      const [photographerProfile] = await sql`
        SELECT * FROM photographers WHERE "_id" = ${booking.creatorId} OR "slug" = ${booking.creatorId} OR "name" = ${booking.creatorId}
      `;
      if (photographerProfile) {
        recipientEmail = photographerProfile.email;
        recipientName = photographerProfile.name;
      }
    }

    // Fallback to nikhiljai1215@gmail.com so Nikhil receives mock booking notifications during tests
    if (!recipientEmail) {
      recipientEmail = 'nikhiljai1215@gmail.com';
      recipientName = creatorUser?.name || 'Nikhil photography (Mock)';
      console.log(`ℹ️  No creator found for ID "${booking.creatorId}" — falling back to nikhiljai1215@gmail.com for test notification.`);
    }

    const clientEmailAddress = clientUser?.email || booking.clientEmail;
    const clientName = clientUser?.name || booking.clientName || 'Valued Customer';

    // 1. Send notification to photographer
    if (recipientEmail) {
      await sendBookingNotification({
        photographerEmail: recipientEmail,
        photographerName: recipientName,
        clientName: clientName,
        clientEmail: clientEmailAddress || '',
        clientPhone: clientUser?.phone || booking.clientPhone || '',
        bookingTitle: booking.title,
        bookingDate: booking.date,
        bookingTime: booking.time,
        bookingPrice: booking.price,
        bookingType: booking.itemType
      }).catch(err => console.error("Edge mailer error (photographer):", err.message));
    }

    // 2. Send confirmation to client
    if (clientEmailAddress) {
      await sendClientBookingConfirmation({
        clientEmail: clientEmailAddress,
        clientName: clientName,
        bookingTitle: booking.title,
        bookingDate: booking.date,
        bookingTime: booking.time,
        bookingPrice: booking.price,
        bookingType: booking.itemType,
        photographerName: recipientName || 'Creator'
      }).catch(err => console.error("Edge mailer error (client):", err.message));
    }
  } catch (err) {
    console.error("Failed to send booking emails:", err.message);
  }
}

// slugify function for photographers GET endpoint auto-sync
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

function maskEmail(email: string | null | undefined): string {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  if (local.length <= 2) {
    return `${local.charAt(0)}***@${domain}`;
  }
  return `${local.charAt(0)}***${local.charAt(local.length - 1)}@${domain}`;
}

serve(async (req) => {
  // Handle CORS preflight options request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  // Match path segments
  const path = url.pathname.replace(/^\/functions\/v1\/api/, '').replace(/^\/api/, '').replace(/\/$/, '');
  const method = req.method;
  console.log(`🚀 Request received: ${method} ${path}`);

  try {
    // Ensure columns exist on the users table
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS "password" TEXT;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS "resetToken" TEXT;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS "resetTokenExpires" TIMESTAMP;`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS "authProvider" TEXT;`;
    } catch (err) {
      console.warn("Schema adjustment check warning:", err.message);
    }

    // Validate request authorization to reveal email addresses
    const reqUserId = req.headers.get('x-user-id');
    const reqAuthProvider = req.headers.get('x-auth-provider');
    
    let isGoogleAuth = false;
    if (reqUserId && reqAuthProvider === 'google') {
      try {
        const [dbUser] = await sql`
          SELECT "authProvider" FROM users 
          WHERE ("id" = ${reqUserId} OR "_id" = ${reqUserId}) AND "authProvider" = 'google'
        `;
        if (dbUser) {
          isGoogleAuth = true;
        }
      } catch (err) {
        console.warn("Authorization verification db check warning:", err.message);
      }
    }

    // ── HEALTH ROUTE ──
    if (path === '/health' && method === 'GET') {
      await sql`SELECT 1`;
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString(), database: 'connected' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ── TEST EMAIL ROUTE ──
    if (path === '/test-email' && method === 'GET') {
      const email = url.searchParams.get('to') || 'nikhiljai1215@gmail.com';
      try {
        const result = await sendBookingNotification({
          photographerEmail: email,
          photographerName: 'Test Photographer',
          clientName: 'Test Client',
          clientEmail: 'client@test.com',
          clientPhone: '1234567890',
          bookingTitle: 'Test Shoot via Supabase Edge',
          bookingDate: '2026-08-15',
          bookingTime: '10:00 AM',
          bookingPrice: 5000,
          bookingType: 'Service'
        });
        return new Response(JSON.stringify({ success: true, result }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // ── TEST BOOKING EMAIL ROUTE ──
    if (path === '/test-booking' && method === 'GET') {
      const bookingId = url.searchParams.get('id');
      try {
        const [booking] = await sql`SELECT * FROM bookings WHERE "_id" = ${bookingId} OR "listingId" = ${bookingId}`;
        if (!booking) {
          return new Response(JSON.stringify({ success: false, error: 'Booking not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        // Find creator user
        let [creatorUser] = await sql`
          SELECT * FROM users WHERE "id" = ${booking.creatorId} OR "_id" = ${booking.creatorId}
        `;
        
        let recipientEmail = creatorUser?.email;
        let recipientName = creatorUser?.name;
        let mappingUsed = 'Database Users Table';

        if (booking.creatorId === '6a380b8173c0e340a6bf3a42') {
          recipientEmail = 'nikhiljai1215@gmail.com';
          recipientName = 'Nikhil photography';
          mappingUsed = 'Direct Mock ID Mapping';
        }

        if (!recipientEmail && booking.creatorId) {
          const [photographerProfile] = await sql`
            SELECT * FROM photographers WHERE "_id" = ${booking.creatorId} OR "slug" = ${booking.creatorId} OR "name" = ${booking.creatorId}
          `;
          if (photographerProfile) {
            recipientEmail = photographerProfile.email;
            recipientName = photographerProfile.name;
            mappingUsed = 'Database Photographers Table';
          }
        }

        if (!recipientEmail) {
          recipientEmail = 'nikhiljai1215@gmail.com';
          recipientName = creatorUser?.name || 'Nikhil photography (Mock)';
          mappingUsed = 'Default Fallback';
        }

        const clientEmailAddress = booking.clientEmail;
        const clientName = booking.clientName;

        // Directly test edgeSendEmails
        await edgeSendEmails(booking);

        return new Response(JSON.stringify({ 
          success: true, 
          booking: {
            id: booking._id,
            title: booking.title,
            creatorId: booking.creatorId,
            clientId: booking.clientId
          },
          photographer: {
            name: recipientName,
            email: recipientEmail,
            mappingUsed
          },
          client: {
            name: clientName,
            email: clientEmailAddress,
            phone: booking.clientPhone
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // ── BOOKINGS ROUTE ──
    if (path === '/bookings') {
      if (method === 'GET') {
        const clientId = url.searchParams.get('clientId');
        const creatorId = url.searchParams.get('creatorId');
        let bookings;
        
        if (clientId && creatorId) {
          bookings = await sql`SELECT * FROM bookings WHERE "clientId" = ${clientId} AND "creatorId" = ${creatorId} ORDER BY "createdAt" DESC`;
        } else if (clientId) {
          bookings = await sql`SELECT * FROM bookings WHERE "clientId" = ${clientId} ORDER BY "createdAt" DESC`;
        } else if (creatorId) {
          bookings = await sql`SELECT * FROM bookings WHERE "creatorId" = ${creatorId} ORDER BY "createdAt" DESC`;
        } else {
          bookings = await sql`SELECT * FROM bookings ORDER BY "createdAt" DESC`;
        }
        const mappedBookings = isGoogleAuth ? bookings : bookings.map(b => ({
          ...b,
          clientEmail: maskEmail(b.clientEmail),
          photographerEmail: maskEmail(b.photographerEmail),
          email: maskEmail(b.email)
        }));
        return new Response(JSON.stringify(mappedBookings), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'POST') {
        const body = await req.json();
        const id = body._id || body.id || `b-${Date.now()}`;
        const [booking] = await sql`
          INSERT INTO bookings (
            "_id", "listingId", "clientId", "creatorId", "itemType", "title", "date", 
            "time", "price", "status", "item", "ownerId", "clientName", "clientEmail", "clientPhone"
          ) VALUES (
            ${id}, 
            ${body.listingId || null}, 
            ${body.clientId || null}, 
            ${body.creatorId || null}, 
            ${body.itemType || null}, 
            ${body.title || null}, 
            ${body.date || null}, 
            ${body.time || null}, 
            ${body.price !== undefined ? JSON.stringify(body.price) : null}, 
            ${body.status || 'pending'}, 
            ${body.item !== undefined ? JSON.stringify(body.item) : null}, 
            ${body.ownerId || null}, 
            ${body.clientName || null}, 
            ${body.clientEmail || null}, 
            ${body.clientPhone || null}
          ) RETURNING *
        `;

        // Async email notifications trigger
        await edgeSendEmails(booking).catch(err => console.error("Edge mail dispatch failed:", err.message));

        return new Response(JSON.stringify(booking), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'PUT') {
        const body = await req.json();
        const { id, status } = body;
        const [updatedBooking] = await sql`
          UPDATE bookings SET "status" = ${status} WHERE "_id" = ${id} OR "listingId" = ${id} RETURNING *
        `;
        return new Response(JSON.stringify(updatedBooking || { id, status, message: 'Updated' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'DELETE') {
        const id = url.searchParams.get('id');
        await sql`DELETE FROM bookings WHERE "_id" = ${id} OR "listingId" = ${id}`;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // ── LISTINGS ROUTE ──
    if (path === '/listings') {
      if (method === 'GET') {
        const type = url.searchParams.get('type');
        let listings;
        if (type) {
          listings = await sql`SELECT * FROM listings WHERE "type" = ${type} ORDER BY "createdAt" DESC`;
        } else {
          listings = await sql`SELECT * FROM listings ORDER BY "createdAt" DESC`;
        }
        return new Response(JSON.stringify(listings), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'POST') {
        const body = await req.json();
        const id = body._id || body.id || `l-${Date.now()}`;
        const [listing] = await sql`
          INSERT INTO listings (
            "_id", "id", "title", "type", "price", "priceUnit", "image", "description", 
            "location", "rating", "reviews", "creatorId", "ownerId", "active", "isFeatured", 
            "amenities", "features", "capacity", "area", "studioType", "categories", 
            "gender", "height", "category", "specs", "includes", "skills", "company", 
            "jobType", "instructor", "date", "timing", "workshopType", "specialization", 
            "experience", "portfolio", "serviceType", "phone", "webUrl", "gmbUrl", "fbUrl"
          ) VALUES (
            ${id}, 
            ${id}, 
            ${body.title || null}, 
            ${body.type || null}, 
            ${body.price !== undefined ? JSON.stringify(body.price) : null}, 
            ${body.priceUnit || null}, 
            ${body.image || null}, 
            ${body.description || null}, 
            ${body.location || null}, 
            ${body.rating !== undefined ? JSON.stringify(body.rating) : null}, 
            ${body.reviews || 0}, 
            ${body.creatorId || null}, 
            ${body.ownerId || null}, 
            ${body.active !== false}, 
            ${body.isFeatured || false}, 
            ${body.amenities !== undefined ? JSON.stringify(body.amenities) : null}, 
            ${body.features !== undefined ? JSON.stringify(body.features) : null}, 
            ${body.capacity || null}, 
            ${body.area || null}, 
            ${body.studioType || null}, 
            ${body.categories !== undefined ? JSON.stringify(body.categories) : null}, 
            ${body.gender || null}, 
            ${body.height || null}, 
            ${body.category || null}, 
            ${body.specs || null}, 
            ${body.includes || null}, 
            ${body.skills !== undefined ? JSON.stringify(body.skills) : null}, 
            ${body.company || null}, 
            ${body.jobType || null}, 
            ${body.instructor || null}, 
            ${body.date || null}, 
            ${body.timing || null}, 
            ${body.workshopType || null}, 
            ${body.specialization || null}, 
            ${body.experience || null}, 
            ${body.portfolio || null}, 
            ${body.serviceType || null},
            ${body.phone || null},
            ${body.webUrl || null},
            ${body.gmbUrl || null},
            ${body.fbUrl || null}
          ) RETURNING *
        `;
        return new Response(JSON.stringify(listing), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'PATCH' || method === 'PUT') {
        const body = await req.json();
        const { id, ...updateData } = body;
        // Use ?? null to avoid postgres.js UNDEFINED_VALUE errors on missing fields
        const [updatedListing] = await sql`
          UPDATE listings SET
            "title"       = COALESCE(${updateData.title       ?? null}, "title"),
            "price"       = COALESCE(${updateData.price != null ? JSON.stringify(updateData.price) : null}::jsonb, "price"),
            "priceUnit"   = COALESCE(${updateData.priceUnit   ?? null}, "priceUnit"),
            "image"       = COALESCE(${updateData.image       ?? null}, "image"),
            "description" = COALESCE(${updateData.description ?? null}, "description"),
            "location"    = COALESCE(${updateData.location    ?? null}, "location"),
            "active"      = COALESCE(${updateData.active      ?? null}, "active"),
            "isFeatured"  = COALESCE(${updateData.isFeatured  ?? null}, "isFeatured"),
            "phone"       = COALESCE(${updateData.phone       ?? null}, "phone"),
            "webUrl"      = COALESCE(${updateData.webUrl      ?? null}, "webUrl"),
            "gmbUrl"      = COALESCE(${updateData.gmbUrl      ?? null}, "gmbUrl"),
            "fbUrl"       = COALESCE(${updateData.fbUrl       ?? null}, "fbUrl")
          WHERE "id" = ${id} OR "_id" = ${id}
          RETURNING *
        `;
        return new Response(JSON.stringify(updatedListing), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'DELETE') {
        const id = url.searchParams.get('id');
        await sql`DELETE FROM listings WHERE "id" = ${id} OR "_id" = ${id}`;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // ── USERS ROUTE ──
    if (path === '/users') {
      if (method === 'GET') {
        const users = await sql`SELECT * FROM users ORDER BY "createdAt" DESC`;
        const mappedUsers = isGoogleAuth ? users : users.map(u => ({ ...u, email: maskEmail(u.email) }));
        return new Response(JSON.stringify(mappedUsers), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'POST') {
        const body = await req.json();
        const id = body._id || body.id || `prof-${Date.now()}`;
        const [newUser] = await sql`
          INSERT INTO users (
            "_id", "id", "name", "email", "role", "avatar", "bio", "location", 
            "rating", "isVerified", "phone", "shoots", "followers", "revenue", "success", "views",
            "studioName", "studio_name", "password", "authProvider"
          ) VALUES (
            ${id}, ${body.id || id}, ${body.name ?? null}, ${body.email ?? null}, ${body.role || 'client'}, 
            ${body.avatar ?? null}, ${body.bio ?? null}, ${body.location ?? null}, ${body.rating ?? null}, ${body.isVerified ?? false}, 
            ${body.phone ?? null}, ${body.shoots ?? null}, ${body.followers ?? null}, ${body.revenue ?? null}, ${body.success ?? null}, ${body.views ?? null},
            ${body.studioName ?? null}, ${body.studioName ?? null}, ${body.password ?? null}, ${body.authProvider ?? 'email'}
          ) ON CONFLICT ("email") DO UPDATE SET
            "name" = EXCLUDED.name,
            "role" = EXCLUDED.role,
            "avatar" = EXCLUDED.avatar,
            "bio" = EXCLUDED.bio,
            "location" = EXCLUDED.location,
            "studioName" = EXCLUDED."studioName",
            "studio_name" = EXCLUDED.studio_name,
            "password" = COALESCE(EXCLUDED.password, users.password),
            "authProvider" = COALESCE(EXCLUDED."authProvider", users."authProvider")
          RETURNING *
        `;
        return new Response(JSON.stringify(newUser), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'PUT') {
        const body = await req.json();
        const { id, ...updateData } = body;
        const [updatedUser] = await sql`
          UPDATE users SET
            "name" = COALESCE(${updateData.name}, "name"),
            "role" = COALESCE(${updateData.role}, "role"),
            "avatar" = COALESCE(${updateData.avatar}, "avatar"),
            "bio" = COALESCE(${updateData.bio}, "bio"),
            "location" = COALESCE(${updateData.location}, "location"),
            "rating" = COALESCE(${updateData.rating}, "rating"),
            "isVerified" = COALESCE(${updateData.isVerified}, "isVerified"),
            "phone" = COALESCE(${updateData.phone}, "phone"),
            "shoots" = COALESCE(${updateData.shoots}, "shoots"),
            "followers" = COALESCE(${updateData.followers}, "followers"),
            "revenue" = COALESCE(${updateData.revenue}, "revenue"),
            "success" = COALESCE(${updateData.success}, "success"),
            "views" = COALESCE(${updateData.views}, "views"),
            "studioName" = COALESCE(${updateData.studioName}, "studioName"),
            "studio_name" = COALESCE(${updateData.studioName}, "studio_name")
          WHERE "id" = ${id} OR "_id" = ${id}
          RETURNING *
        `;
        return new Response(JSON.stringify(updatedUser), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (method === 'DELETE') {
        const id = url.searchParams.get('id');
        // Fetch user email first to delete linked listings and partner profiles
        const [user] = await sql`SELECT "email" FROM users WHERE "id" = ${id} OR "_id" = ${id}`;
        if (user && user.email) {
          const email = user.email.toLowerCase().trim();
          
          // If the profile belongs to Nikhil, delete all seeded listings/photographer profiles using ID 6a380b8173c0e340a6bf3a42
          if (email === 'nikhiljai1215@gmail.com') {
            await sql`DELETE FROM listings WHERE "creatorId" = '6a380b8173c0e340a6bf3a42' OR "ownerId" = '6a380b8173c0e340a6bf3a42'`;
            await sql`DELETE FROM photographers WHERE "_id" = '6a380b8173c0e340a6bf3a42' OR LOWER(TRIM("email")) = 'nikhiljai1215@gmail.com'`;
            await sql`DELETE FROM bookings WHERE "creatorId" = '6a380b8173c0e340a6bf3a42' OR "ownerId" = '6a380b8173c0e340a6bf3a42'`;
          }
          
          await sql`DELETE FROM listings WHERE "creatorId" = ${id} OR "ownerId" = ${id} OR "id" = ${id} OR "_id" = ${id}`;
          await sql`DELETE FROM photographers WHERE "_id" = ${id} OR LOWER(TRIM("email")) = ${email}`;
          await sql`DELETE FROM bookings WHERE "creatorId" = ${id} OR "ownerId" = ${id} OR "clientId" = ${id} OR LOWER(TRIM("clientEmail")) = ${email}`;
        } else {
          await sql`DELETE FROM listings WHERE "creatorId" = ${id} OR "ownerId" = ${id} OR "id" = ${id} OR "_id" = ${id}`;
          await sql`DELETE FROM photographers WHERE "_id" = ${id}`;
          await sql`DELETE FROM bookings WHERE "creatorId" = ${id} OR "ownerId" = ${id} OR "clientId" = ${id}`;
        }
        await sql`DELETE FROM users WHERE "id" = ${id} OR "_id" = ${id}`;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // ── PHOTOGRAPHERS ROUTE ──
    if (path === '/photographers') {
      if (method === 'GET') {
        // Sync role: 'photographer' registered users
        const registered = await sql`SELECT * FROM users WHERE "role" = 'photographer'`;
        for (const u of registered) {
          const [exists] = await sql`SELECT 1 FROM photographers WHERE "email" = ${u.email}`;
          if (!exists) {
            const baseSlug = slugify(u.name);
            const randSuffix = Math.floor(1000 + Math.random() * 9000);
            await sql`
              INSERT INTO photographers ("_id", "name", "slug", "location", "isVerified", "email", "code", "status")
              VALUES (${u._id}, ${u.name}, ${`${baseSlug}-${randSuffix}`}, ${u.location || 'Unknown'}, ${u.isVerified || false}, ${u.email}, 'No Code', 'Active')
            `;
          }
        }

        const photographers = await sql`SELECT * FROM photographers ORDER BY "createdAt" ASC`;
        const mappedPhotographers = isGoogleAuth ? photographers : photographers.map(p => ({ ...p, email: maskEmail(p.email) }));
        return new Response(JSON.stringify(mappedPhotographers), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'POST') {
        const body = await req.json();
        const id = body._id || `p-${Date.now()}`;
        const [p] = await sql`
          INSERT INTO photographers ("_id", "name", "slug", "location", "isVerified", "code", "status", "email")
          VALUES (${id}, ${body.name}, ${body.slug}, ${body.location}, ${body.isVerified || false}, ${body.code || 'No Code'}, ${body.status || 'Active'}, ${body.email})
          RETURNING *
        `;
        return new Response(JSON.stringify(p), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'PATCH') {
        const body = await req.json();
        const { id, ...updates } = body;
        const [p] = await sql`
          UPDATE photographers SET
            "isVerified" = COALESCE(${updates.isVerified ?? null}, "isVerified"),
            "code" = COALESCE(${updates.code ?? null}, "code"),
            "status" = COALESCE(${updates.status ?? null}, "status")
          WHERE "_id" = ${id}
          RETURNING *
        `;

        if (p) {
          if (updates.isVerified !== undefined && p.email) {
            await sql`UPDATE users SET "isVerified" = ${updates.isVerified} WHERE "email" = ${p.email}`;
          }

          if (updates.code && updates.code !== 'No Code' && p.email) {
            await sendVerificationCodeEmail({
              photographerEmail: p.email,
              photographerName: p.name,
              code: updates.code
            }).catch(err => console.error("Edge verification code mail error:", err.message));
          }
        }
        return new Response(JSON.stringify(p), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'DELETE') {
        const id = url.searchParams.get('id');
        await sql`DELETE FROM photographers WHERE "_id" = ${id}`;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // ── VERIFY PHOTOGRAPHER ROUTE ──
    if (path === '/verify-photographer' && method === 'POST') {
      const body = await req.json();
      const { email, code } = body;
      
      if (!email || !code) {
        return new Response(JSON.stringify({ error: 'email and code are required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const [photographer] = await sql`
        SELECT * FROM photographers WHERE LOWER(TRIM("email")) = LOWER(TRIM(${email}))
      `;

      if (!photographer) {
        return new Response(JSON.stringify({ error: 'No photographer found with this email address.' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (photographer.isVerified) {
        return new Response(JSON.stringify({ success: true, alreadyVerified: true, message: 'Your profile is already verified!' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (!photographer.code || photographer.code === 'No Code') {
        return new Response(JSON.stringify({ error: 'No verification code has been issued for this profile yet.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (photographer.code.trim().toUpperCase() !== code.trim().toUpperCase()) {
        return new Response(JSON.stringify({ error: 'Incorrect verification code. Please check your email and try again.' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      await sql`UPDATE photographers SET "isVerified" = true WHERE "_id" = ${photographer._id}`;
      const [updatedUser] = await sql`
        UPDATE users SET "isVerified" = true WHERE LOWER(TRIM("email")) = LOWER(TRIM(${email})) RETURNING *
      `;

      return new Response(JSON.stringify({
        success: true,
        message: 'Your PickMyShoot Partner profile is now verified!',
        user: updatedUser
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ── LOGIN ROUTE ──
    if (path === '/login' && method === 'POST') {
      const body = await req.json();
      const email = body.email?.trim()?.toLowerCase();
      const password = body.password;

      if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Email and password are required.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const [user] = await sql`
        SELECT * FROM users WHERE LOWER(TRIM("email")) = ${email}
      `;

      if (!user) {
        return new Response(JSON.stringify({ error: 'User does not exist. Please register first.' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (user.password && user.password !== password) {
        return new Response(JSON.stringify({ error: 'Incorrect password. Please try again.' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      return new Response(JSON.stringify({ success: true, user }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ── LOGIN ACTIVITY ROUTE ──
    if (path === '/login-activity') {
      if (method === 'POST') {
        const body = await req.json();
        const { userId, name, email, role, avatar } = body;
        
        if (!userId || !name || !email || !role) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const id = `la-${Date.now()}`;
        const [activity] = await sql`
          INSERT INTO login_activities ("_id", "userId", "name", "email", "role", "avatar")
          VALUES (${id}, ${userId}, ${name}, ${email}, ${role}, ${avatar})
          RETURNING *
        `;

        // Trim to latest 200 logs
        const [countRow] = await sql`SELECT count(*) FROM login_activities`;
        const count = parseInt(countRow.count, 10);
        if (count > 200) {
          await sql`
            DELETE FROM login_activities WHERE "_id" IN (
              SELECT "_id" FROM login_activities ORDER BY "loginTime" ASC LIMIT ${count - 200}
            )
          `;
        }
        return new Response(JSON.stringify(activity), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'GET') {
        const role = url.searchParams.get('role');
        const limit = parseInt(url.searchParams.get('limit') || '50', 10);
        let activities;
        if (role) {
          activities = await sql`SELECT * FROM login_activities WHERE "role" = ${role} ORDER BY "loginTime" DESC LIMIT ${limit}`;
        } else {
          activities = await sql`SELECT * FROM login_activities ORDER BY "loginTime" DESC LIMIT ${limit}`;
        }
        return new Response(JSON.stringify(activities), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'DELETE') {
        await sql`DELETE FROM login_activities`;
        return new Response(JSON.stringify({ message: 'Login activity cleared.' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // ── MESSAGES ROUTE ──
    if (path === '/messages') {
      if (method === 'GET') {
        const userId = url.searchParams.get('userId');
        if (!userId) {
          return new Response(JSON.stringify({ error: 'userId parameter is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        const msgs = await sql`
          SELECT * FROM messages 
          WHERE "senderId" = ${userId} OR "recipientId" = ${userId} 
          ORDER BY "createdAt" ASC
        `;
        return new Response(JSON.stringify(msgs), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'POST') {
        const body = await req.json();
        const id = body._id || body.id || `msg-${Date.now()}`;
        
        if (!body.sessionId || !body.senderId || !body.recipientId || !body.text) {
          return new Response(JSON.stringify({ error: 'Missing required message parameters' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const [msg] = await sql`
          INSERT INTO messages ("_id", "sessionId", "senderId", "recipientId", "text", "time")
          VALUES (${id}, ${body.sessionId}, ${body.senderId}, ${body.recipientId}, ${body.text}, ${body.time ?? null})
          RETURNING *
        `;
        return new Response(JSON.stringify(msg), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // ── CONTACT ROUTE ──
    if (path === '/contact' && method === 'POST') {
      const body = await req.json();
      const { name, email, subject, message } = body;

      if (!name || !email || !subject || !message) {
        return new Response(JSON.stringify({ error: 'All fields are required (name, email, subject, message)' }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      // Send email to admin
      const adminResult = await sendContactFormEmail({ name, email, subject, message });

      // Send receipt to user (non-blocking)
      sendContactReceiptEmail({ name, email, subject, message }).catch(err => {
        console.error('Error sending contact receipt email:', err.message);
      });

      return new Response(JSON.stringify({ 
        success: adminResult.sent, 
        message: adminResult.sent ? 'Message sent successfully!' : 'Failed to send message email.',
        details: adminResult.reason || null
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // ── FORGOT PASSWORD ROUTE ──
    if (path === '/forgot-password' && method === 'POST') {
      try {
        const body = await req.json();
        const email = body.email?.trim()?.toLowerCase();
        if (!email) {
          return new Response(JSON.stringify({ success: false, error: 'Email is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const [user] = await sql`SELECT * FROM users WHERE LOWER("email") = ${email}`;
        if (!user) {
          return new Response(JSON.stringify({ success: false, error: 'User with this email does not exist.' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Generate reset token
        const resetToken = crypto.randomUUID();
        const expires = new Date(Date.now() + 3600000); // 1 hour expiry

        await sql`
          UPDATE users 
          SET "resetToken" = ${resetToken}, "resetTokenExpires" = ${expires} 
          WHERE "id" = ${user.id}
        `;

        // Send email
        const resetLink = `${appUrl}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
          from: `"PickMyShoot" <${smtpEmail}>`,
          to: user.email,
          subject: '🔒 Reset Your PickMyShoot Password',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; padding:0; background:#f4f4f7; font-family: 'Segoe UI', Roboto, sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7; padding: 32px 0;">
                <tr>
                  <td align="center">
                    <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #FF4D5A 0%, #C8102E 100%); padding: 24px 32px; text-align: center;">
                          <h1 style="color:#fff; margin:0; font-size:20px; font-weight:700;">PickMyShoot</h1>
                        </td>
                      </tr>
                      <!-- Body -->
                      <tr>
                        <td style="padding: 32px; color:#333;">
                          <p style="font-size:15px; margin:0 0 16px; line-height:1.6;">Hi ${user.name || 'User'},</p>
                          <p style="font-size:15px; margin:0 0 24px; line-height:1.6;">
                            We received a request to reset your password for your PickMyShoot account. Click the button below to choose a new password. This link is valid for 1 hour.
                          </p>
                          <div style="text-align: center; margin-bottom: 28px;">
                            <a href="${resetLink}" target="_blank" style="background:#C8102E; color:#ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Reset Password</a>
                          </div>
                          <p style="font-size: 13px; color:#666; margin:0 0 8px;">If the button doesn't work, copy and paste this link in your browser:</p>
                          <p style="font-size: 12px; color:#C8102E; margin:0; word-break: break-all;">${resetLink}</p>
                        </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td style="background:#f8f9fa; padding: 16px; text-align: center; font-size: 12px; color:#888; border-top:1px solid #eee;">
                          If you did not request a password reset, you can safely ignore this email.
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

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ success: true, message: 'Reset password email sent.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // ── RESET PASSWORD ROUTE ──
    if (path === '/reset-password' && method === 'POST') {
      try {
        const body = await req.json();
        const { token, password } = body;
        if (!token || !password) {
          return new Response(JSON.stringify({ success: false, error: 'Token and password are required.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Find user with valid token
        const [user] = await sql`
          SELECT * FROM users 
          WHERE "resetToken" = ${token} AND "resetTokenExpires" > NOW()
        `;

        if (!user) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid or expired reset token.' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Update user password and clear token
        await sql`
          UPDATE users 
          SET "password" = ${password}, "resetToken" = NULL, "resetTokenExpires" = NULL 
          WHERE "id" = ${user.id}
        `;

        return new Response(JSON.stringify({ success: true, message: 'Password updated successfully!' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Default 404 Response
    return new Response(JSON.stringify({ error: `Route not found: ${method} ${path}` }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error(`Edge runtime error [${method} ${path}]:`, err.message);
    return new Response(JSON.stringify({ error: 'Server error', details: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
