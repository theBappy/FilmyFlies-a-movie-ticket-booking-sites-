import Stripe from "stripe";
import Booking from "../models/booking.model.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ Use secret key here

export const stripeWebhooks = async (request, response) => {
  const signature = request.headers["stripe-signature"];

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": { // ✅ This is the correct event for Stripe Checkout
        const session = event.data.object;
        const { bookingId } = session.metadata;

        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: "", // ✅ Typo fix: was "paymentLint"
        });

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    response.status(500).send("Internal Server Error");
  }
};
