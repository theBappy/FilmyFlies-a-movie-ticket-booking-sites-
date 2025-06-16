import stripe from "stripe";
import Booking from "../models/booking.model.js";

export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_WEBHOOK_SECRET);
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
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });
        const session = sessionList.data[0];
        const { bookingId } = session.metadata;

        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLint: "",
        });
        break;
      }
      default:
        console.log("Unhandled event type: ", event.type);
    }
    response.json({received: true})
  } catch (error) {
    console.log('Webhook processing error: ',error)
    response.status(500).send('Internal server Error')
  } 
};
