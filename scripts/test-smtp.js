import nodemailer from 'nodemailer';

const smtpEmail = 'anusripvc202@gmail.com';
const smtpPassword = 'mrzplpjgedrqljrx';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: smtpEmail,
    pass: smtpPassword
  }
});

async function testEmail() {
  console.log('Testing SMTP connection...');
  
  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    // Send a test email
    const info = await transporter.sendMail({
      from: `"PickMyShoot Test" <${smtpEmail}>`,
      to: 'nikhiljai1215@gmail.com',
      subject: '✅ PickMyShoot SMTP Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f7;">
          <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <h2 style="color: #C8102E; margin-top: 0;">📸 PickMyShoot</h2>
            <h3 style="color: #222;">SMTP Test Successful! ✅</h3>
            <p style="color: #555; line-height: 1.6;">
              Your Gmail SMTP is configured correctly.<br>
              Booking notifications will now be sent from <strong>${smtpEmail}</strong>.
            </p>
            <p style="color: #888; font-size: 12px; margin-top: 20px;">
              Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            </p>
          </div>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log(`   Check your inbox at: ${smtpEmail}`);

  } catch (error) {
    console.error('❌ SMTP test failed:', error.message);
    if (error.message.includes('Invalid login')) {
      console.error('   → Check your Gmail App Password is correct.');
    }
    if (error.message.includes('Username and Password not accepted')) {
      console.error('   → Make sure 2-Step Verification is ON and App Password is valid.');
    }
  }
}

testEmail();
