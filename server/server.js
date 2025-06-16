import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from './inngest/index.js';
import connectDB from './config/db.js'

import showRouter from './routes/show.routes.js'
import bookingRouter from './routes/booking.route.js'
import adminRouter from './routes/admin.route.js'
import userRouter from './routes/user.route.js'
import { stripeWebhooks } from './payments/stripe.webhook.js'

const app = express()
const PORT = process.env.PORT || 3000

// ✅ Stripe Webhook route must come first and use raw body
app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// ✅ Now load regular middleware
app.use(cors())
app.use(express.json())

// ✅ Optional: use Clerk only for protected routes (recommended)
app.use(clerkMiddleware())

// ✅ Routes
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use("/api/inngest", serve({ client: inngest, functions }))
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

// ✅ Connect to DB, then start server
await connectDB()

app.listen(PORT, () => {
  console.log(`🚀 Server is listening at http://localhost:${PORT}`)
})
