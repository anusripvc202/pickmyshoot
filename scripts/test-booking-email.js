import nodemailer from 'nodemailer';

const smtpEmail = 'anusripvc202@gmail.com';
const smtpPassword = 'mrzplpjgedrqljrx';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: smtpEmail, pass: smtpPassword }
});

// Simulate a real booking notification to a photographer
async function testBookingNotification() {
  console.log('Sending test booking notification to photographer...\n');

  // --- Email 1: To Photographer ---
  const photographerEmail = 'anusripvc204@gmail.com'; // Jaideepvarma's email
  const info1 = await transporter.sendMail({
    from: `"PickMyShoot" <${smtpEmail}>`,
    to: photographerEmail,
    subject: `🎯 New Booking Request — Wedding Photography Package`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0; padding:0; background:#f4f4f7; font-family: 'Segoe UI', sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7; padding: 32px 0;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <tr>
                <td style="background: linear-gradient(135deg, #C8102E 0%, #FF4D5A 100%); padding: 28px 32px; text-align: center;">
                  <h1 style="color:#fff; margin:0; font-size:22px; font-weight:800;">📸 PickMyShoot</h1>
                  <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:13px;">New Booking Notification</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 28px 32px;">
                  <p style="font-size:15px; color:#333; margin:0 0 18px; line-height:1.6;">
                    Hi <strong>Jaideepvarma</strong>,<br><br>
                    You have a new <strong>service</strong> booking request on PickMyShoot!
                  </p>
                  <table width="100%" style="background:#f8f9fb; border:1px solid #e8eaed; border-radius:12px;">
                    <tr><td style="padding:20px 24px;">
                      <table width="100%">
                        <tr>
                          <td style="font-size:13px; color:#888; font-weight:600;">BOOKING</td>
                          <td style="font-size:14px; color:#222; font-weight:700; text-align:right;">Wedding Photography Package</td>
                        </tr>
                        <tr><td colspan="2" style="border-bottom:1px solid #e8eaed; padding:4px 0;"></td></tr>
                        <tr>
                          <td style="font-size:13px; color:#888; font-weight:600; padding-top:8px;">DATE</td>
                          <td style="font-size:14px; color:#222; font-weight:600; text-align:right; padding-top:8px;">15 August 2026</td>
                        </tr>
                        <tr><td colspan="2" style="border-bottom:1px solid #e8eaed; padding:4px 0;"></td></tr>
                        <tr>
                          <td style="font-size:13px; color:#888; font-weight:600; padding-top:8px;">TIME</td>
                          <td style="font-size:14px; color:#222; font-weight:600; text-align:right; padding-top:8px;">10:00 AM</td>
                        </tr>
                        <tr><td colspan="2" style="border-bottom:1px solid #e8eaed; padding:4px 0;"></td></tr>
                        <tr>
                          <td style="font-size:13px; color:#888; font-weight:600; padding-top:8px;">AMOUNT</td>
                          <td style="font-size:15px; color:#C8102E; font-weight:800; text-align:right; padding-top:8px;">₹25,000</td>
                        </tr>
                      </table>
                    </td></tr>
                  </table>

                  <table width="100%" style="background:#fef7f7; border:1px solid #fde2e2; border-radius:12px; margin-top:16px;">
                    <tr><td style="padding:16px 24px;">
                      <p style="margin:0 0 8px; font-size:12px; color:#888; font-weight:700; text-transform:uppercase;">Client Details</p>
                      <p style="margin:0; font-size:14px; color:#333; line-height:1.7;">
                        <strong>Name:</strong> Jaideep<br>
                        <strong>Email:</strong> anusripvc203@gmail.com<br>
                        <strong>Phone:</strong> +91 77777 66666
                      </p>
                    </td></tr>
                  </table>

                  <table width="100%" style="margin-top:24px;"><tr><td align="center">
                    <a href="https://pickmyshoot-phi.vercel.app/dashboard/photographer"
                       style="display:inline-block; background:linear-gradient(135deg, #C8102E, #FF4D5A); color:#fff; text-decoration:none; padding:13px 36px; border-radius:10px; font-size:14px; font-weight:700;">
                      View Booking →
                    </a>
                  </td></tr></table>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 32px; background:#f8f9fb; border-top:1px solid #e8eaed; text-align:center;">
                  <p style="font-size:11px; color:#aaa; margin:0;">
                    This is an automated notification from PickMyShoot.<br>
                    © 2026 PickMyShoot — Every Story Builds a Brand.
                  </p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `
  });

  console.log('✅ Photographer notification sent!');
  console.log('   FROM:', smtpEmail);
  console.log('   TO:', photographerEmail);
  console.log('   Message ID:', info1.messageId);

  // --- Email 2: To Client ---
  const clientEmail = 'anusripvc203@gmail.com'; // Jaideep (client)
  const info2 = await transporter.sendMail({
    from: `"PickMyShoot" <${smtpEmail}>`,
    to: clientEmail,
    subject: `🎉 Booking Confirmed — Wedding Photography Package`,
    html: `
      <div style="font-family:Arial,sans-serif; padding:20px; background:#f4f4f7;">
        <div style="max-width:500px; margin:0 auto; background:#fff; border-radius:12px; padding:30px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <h2 style="color:#1E3A8A; margin-top:0;">📸 PickMyShoot</h2>
          <h3>Your booking is confirmed! 🎉</h3>
          <p style="color:#555;">Hi <strong>Jaideep</strong>, your booking for <strong>Wedding Photography Package</strong> with <strong>Jaideepvarma</strong> has been successfully placed.</p>
          <p style="color:#555;">📅 Date: <strong>15 August 2026</strong><br>⏰ Time: <strong>10:00 AM</strong><br>💰 Amount: <strong>₹25,000</strong></p>
          <p style="color:#888; font-size:12px; margin-top:20px;">© 2026 PickMyShoot — Every Story Builds a Brand.</p>
        </div>
      </div>
    `
  });

  console.log('\n✅ Client confirmation sent!');
  console.log('   FROM:', smtpEmail);
  console.log('   TO:', clientEmail);
  console.log('   Message ID:', info2.messageId);

  console.log('\n🎯 Both emails sent successfully from:', smtpEmail);
}

testBookingNotification().catch(console.error);
