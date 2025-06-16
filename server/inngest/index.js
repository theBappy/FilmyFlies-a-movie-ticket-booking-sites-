import { Inngest } from "inngest";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Show from "../models/shows.model.js";
import sendEmail from "../email-confirmation/nodemailer.js";



// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.create(userData);
  }
);

// inngest function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// inngest function to update user from database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  }
);

// inngest function to cancel booking and release seats of show after 15 minutes of booking created if payment is not made
const releaseSeatAndDeleteBooking = inngest.createFunction(
  {id: 'release-seats-delete-booking'},
  {event: 'app/checkpayment'},
  async({event, step}) =>{
    const fifteenMinutesLater = new Date(Date.now() + 15 * 60 *1000)
    await step.sleepUntil('wait-for-15-minutes', fifteenMinutesLater)
    await step.run('check-payment-status', async() =>{
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId)

      // check isPaid status if false after 15 mins release the selected seat and delete booking
      if(!booking.isPaid){
        const show = await Show.findById(booking.show)
        booking.bookedSeats.forEach((seat) =>{
          delete show.occupiedSeats[seat]
        })
        show.markModified('occupiedSeats')
        await show.save()
        await Booking.findByIdAndDelete(booking._id)
      }
    })
  }
)

// inngest function to send an email when user booked show 

export const sendBookingConfirmationEmail = inngest.createFunction(
  { id: 'send-booking-confirmation-email' },
  { event: 'app/show.booked' },
  async ({ event, step }) => {
    const { bookingId } = event.data;

    // ✅ Step 1: Ensure MongoDB is connected
    if (mongoose.connection.readyState === 0) {
      await step.run("connect-db", async () => {
        console.log("🔗 Connecting to MongoDB...");
        await connectDB();
      });
    }

    // ✅ Step 2: Fetch booking
    const booking = await step.run("fetch-booking", async () => {
      return await Booking.findById(bookingId)
        .populate({
          path: 'show',
          populate: { path: 'movie', model: 'Movie' },
        })
        .populate('user');
    });

    // ✅ Step 3: Send email
    await step.run("send-email", async () => {
      return await sendEmail({
        to: booking.user.email,
        subject: `🎟️ Booking Reserved for "${booking.show.movie.title}"`,
        booking,
        timeZone: 'Asia/Dhaka',
      });
    });

    return { success: true };
  }
);
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation, releaseSeatAndDeleteBooking, sendBookingConfirmationEmail];
