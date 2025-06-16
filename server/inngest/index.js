import { Inngest } from "inngest";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Show from "../models/shows.model.js";
import sendEmail from "../email-confirmation/nodemailer.js";
import reminderEmailBody from "../email-confirmation/reminder-email.js";



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
  async ({ event }) => {
    const { bookingId } = event.data;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: 'show',
        populate: { path: 'movie', model: 'Movie' },
      })
      .populate('user');

    await sendEmail({
      to: booking.user.email,
      subject: `🎟️ Booking Reserved for "${booking.show.movie.title}"`,
      booking, 
      timeZone: 'Asia/Dhaka', 
    });
  }
);

// inngest function to send reminders
const sendReminders = inngest.createFunction(
  {id: "send-show-reminders"},
  {cron: "0 */8 * * *"}, // every 8 hours
  async({step}) =>{
    const now = new Date()
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000)
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000)

    // prepare reminder tasks
    const reminderTask = await step.run('prepare-reminder-tasks', async() =>{
      const shows = await Show.find({
        showTime: {$gte: windowStart, $lte: in8Hours},
      }).populate('movie')
      const tasks = []

      for(const show of shows){
        if(!show.movie || !show.occupiedSeats) continue;
        const userIds = [...new Set(Object.values(show.occupiedSeats))]
        if(userIds.length === 0) continue;
        const users = await User.find({_id: {$in : userIds}}).select('name email')

        for(const user of users){
          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showTime,
          })
        }
      }
      return tasks;
    })
    if(reminderTask.length === 0){
      return {sent: 0, message: 'No reminders to send.'}
    }
    // send reminders email
    const results = await step.run('send-all-reminder', async() =>{
      return await Promise.allSettled(
        reminderTask.map(task => sendEmail({
          to: task.userEmail,
          subject: `Reminder: Your movie "${task.movieTitle}" starts soon!`,
          html: reminderEmailBody({
            userName: task.userName,
            movieTitle: task.movieTitle,
            showTime: task.showTime,
            timeZone: 'Asia/Dhaka'
          }),
        }))
      )
    })
    const sent = results.filter(res => res.status === 'fulfilled').length;
    const failed = results.length - sent;
    return {
      sent, failed, message: `Sent ${sent} reminder(s), ${failed} failed.`
    }
  }

)

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation, releaseSeatAndDeleteBooking, sendBookingConfirmationEmail, sendReminders];
