import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from './inngest/index.js';
import connectDB from './config/db.js'


const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use("/api/inngest", serve({ client: inngest, functions }));

// ✅ First connect to DB, then start server
await connectDB()

app.listen(PORT, () => {
  console.log(`🚀 Server is listening at http://localhost:${PORT}`)
})
