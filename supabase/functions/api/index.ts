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

    // Fallback to SMTP_EMAIL
    if (!recipientEmail) {
      recipientEmail = Deno.env.get('SMTP_EMAIL') || 'anusripvc202@gmail.com';
      recipientName = creatorUser?.name || 'Demo Photographer (Mock Profile)';
      console.log(`ℹ️  No creator found for ID "${booking.creatorId}" — falling back to SMTP_EMAIL for demo notification.`);
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
    // ── HEALTH ROUTE ──
    if (path === '/health' && method === 'GET') {
      await sql`SELECT 1`;
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString(), database: 'connected' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
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
        return new Response(JSON.stringify(bookings), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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
            "experience", "portfolio", "serviceType"
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
            ${body.serviceType || null}
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
            "isFeatured"  = COALESCE(${updateData.isFeatured  ?? null}, "isFeatured")
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
        return new Response(JSON.stringify(users), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (method === 'POST') {
        const body = await req.json();
        const id = body._id || body.id || `prof-${Date.now()}`;
        const [newUser] = await sql`
          INSERT INTO users (
            "_id", "id", "name", "email", "role", "avatar", "bio", "location", 
            "rating", "isVerified", "phone", "shoots", "followers", "revenue", "success", "views",
            "studioName", "studio_name"
          ) VALUES (
            ${id}, ${body.id || id}, ${body.name}, ${body.email}, ${body.role || 'client'}, 
            ${body.avatar}, ${body.bio}, ${body.location}, ${body.rating}, ${body.isVerified || false}, 
            ${body.phone}, ${body.shoots}, ${body.followers}, ${body.revenue}, ${body.success}, ${body.views},
            ${body.studioName || null}, ${body.studioName || null}
          ) ON CONFLICT ("email") DO UPDATE SET
            "name" = EXCLUDED.name,
            "role" = EXCLUDED.role,
            "avatar" = EXCLUDED.avatar,
            "bio" = EXCLUDED.bio,
            "location" = EXCLUDED.location,
            "studioName" = EXCLUDED."studioName",
            "studio_name" = EXCLUDED.studio_name
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
        return new Response(JSON.stringify(photographers), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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
            "isVerified" = COALESCE(${updates.isVerified}, "isVerified"),
            "code" = COALESCE(${updates.code}, "code"),
            "status" = COALESCE(${updates.status}, "status")
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
