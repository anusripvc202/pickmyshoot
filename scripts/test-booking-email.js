import 'dotenv/config';
import { sendBookingNotification, sendClientBookingConfirmation } from '../api/_utils/mailer.js';

async function testEmails() {
  const testEmail = process.env.SMTP_EMAIL;
  
  if (!testEmail) {
    console.error('❌ SMTP_EMAIL is not set in your environment configuration.');
    process.exit(1);
  }

  console.log(`🚀 Starting mailer test using address: ${testEmail}\n`);

  const mockBooking = {
    bookingTitle: 'Premium Pre-Wedding Portrait Session',
    bookingDate: '15 Aug 2026',
    bookingTime: '09:00 AM - 01:00 PM',
    bookingPrice: 25000,
    bookingType: 'Studio Photoshoot',
    photographerName: 'Nikhil Jai (Creative Studio Owner)',
    clientName: 'John Doe (Visual Director)',
    clientEmail: testEmail,
    clientPhone: '+91 98765 43210'
  };

  console.log('Sending Photographer Notification email...');
  const photographerRes = await sendBookingNotification({
    photographerEmail: testEmail,
    photographerName: mockBooking.photographerName,
    clientName: mockBooking.clientName,
    clientEmail: mockBooking.clientEmail,
    clientPhone: mockBooking.clientPhone,
    bookingTitle: mockBooking.bookingTitle,
    bookingDate: mockBooking.bookingDate,
    bookingTime: mockBooking.bookingTime,
    bookingPrice: mockBooking.bookingPrice,
    bookingType: mockBooking.bookingType
  });
  console.log('Photographer email send result:', photographerRes);

  console.log('\nSending Client Confirmation email...');
  const clientRes = await sendClientBookingConfirmation({
    clientEmail: testEmail,
    clientName: mockBooking.clientName,
    bookingTitle: mockBooking.bookingTitle,
    bookingDate: mockBooking.bookingDate,
    bookingTime: mockBooking.bookingTime,
    bookingPrice: mockBooking.bookingPrice,
    bookingType: mockBooking.bookingType,
    photographerName: mockBooking.photographerName
  });
  console.log('Client email send result:', clientRes);

  console.log('\n🎉 Mailer test complete!');
}

testEmails().catch(err => {
  console.error('❌ Test failed with error:', err);
});
