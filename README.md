# 🎬 FilmyFlies – Movie Ticket Booking Web App

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge\&logo=prisma\&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-yellowgreen?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge\&logo=stripe\&logoColor=white)
![Inngest](https://img.shields.io/badge/Inngest-1e293b?style=for-the-badge\&logoColor=white)

</div>

---

## 📌 Overview

**FilmyFlies** is a full-featured movie ticket booking platform built with modern web technologies. It allows users to explore shows, watch trailers, select seats, make payments, and receive timely email notifications. It also features a powerful admin dashboard for show and booking management.

---

## 🧩 Key Features

### 🧑‍💻 User Features

* ✅ Beautiful and responsive UI using **TailwindCSS**
* 🎥 Browse movies and **watch trailers**
* 🪑 **Interactive seat map** to select & reserve seats
* 💳 Secure payments via **Stripe**
* ⏱️ Auto-expiry: Booking expires if not paid within 15 minutes
* 📧 Email notifications for:

  * Booking confirmation
  * Payment status
  * Show reminders (8 hours before show)
  * New show alerts

### 🛠 Admin Features

* 📊 Access to **Admin Dashboard**
* ➕ Add new shows with movie info, time, seats, etc.
* 💰 View total revenue and booking analytics
* 📋 See list of all user bookings
* 🎦 Manage movies & shows efficiently

---

## 🛠 Tech Stack

| Frontend     | Backend    | Database & Others      |
| ------------ | ---------- | ---------------------- |
| React.js     | Node.js    | MongoDB + Mongoose     |
| Tailwind CSS | Express.js | Prisma ORM (optional)  |
| Heroicons    | Nodemailer | Clerk (Authentication) |
|              | Inngest    | Stripe (Payments)      |
|              |            | Brevo SMTP (Emails)    |

---

## 📁 Project Structure (Simplified)

```
/client         # React Frontend (FilmyFlies UI)
  /components
  /pages
/server         # Express Backend
  /routes
  /controllers
  /models
  /email-confirmation
  /payments
.env            # Environment Variables (Stripe, SMTP, DB, etc.)
```

---

## ⚙️ System Features

* ⚡ Real-time seat blocking until payment is made
* 🔐 Clerk-powered secure authentication
* 📬 Nodemailer + Brevo for transactional emails
* 🧠 Inngest for background jobs (email reminders, show alerts)
* 💵 Stripe Checkout for secure payments

---

## 🛎 Planned Enhancements

* 🎫 User Booking History UI
* 🌍 Region/timezone-aware date display
* 🌟 Movie ratings & reviews
* 📩 Ticket download as PDF

---

## 🧪 Testing & Deployment

* Jest for backend unit testing (optional setup)
* Environment-ready for **Render**, **Railway**, or **Vercel**

---

## 🙌 Contributing

PRs are welcome! Open issues or suggest improvements 💡

---

## 👤 Author

Made with 💙 by **\[theBappy]**
