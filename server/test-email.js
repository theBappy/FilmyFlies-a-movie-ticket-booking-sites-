import sendEmail from "./email-confirmation/nodemailer.js";
import Booking from "./models/booking.model.js";


const booking = await Booking.findOne().populate('show').populate('user');
await sendEmail({
  to: booking.user.email,
  subject: "Test Email",
  booking,
  timeZone: 'Asia/Dhaka'
});
