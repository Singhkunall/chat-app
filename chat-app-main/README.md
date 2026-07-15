# QuickChat 💬

A full-stack real-time chat application built with the MERN stack, featuring instant messaging, image sharing, and an emergency SOS safety feature that sets it apart from a typical chat app.

**Live App:** [chat-app-ruddy-tau-67.vercel.app](https://chat-app-ruddy-tau-67.vercel.app)

---

## Why this project is different

Most chat app clones stop at "send and receive messages." QuickChat adds a **safety layer** on top of real-time chat — because a messaging app can do more than just message people.

If a user feels unsafe or is in an emergency, they can tap a single SOS button. Their live location is instantly sent to their trusted contacts — through a real-time notification if the contact is online, and through an automated email (with a direct Google Maps link) so the alert reaches them even if they're not using the app at that moment.

---

## Features

- 🔐 Secure signup/login with JWT authentication and bcrypt password hashing
- 💬 Real-time one-to-one messaging using Socket.io
- 🖼️ Image sharing in chat, powered by Cloudinary
- 🟢 Live online/offline status for users
- 👀 Unseen message tracking per conversation
- 🙍 Editable user profile with profile picture, name, and bio
- 🚨 **SOS Emergency Alert** — sends live location to trusted contacts via real-time socket + email
- 👥 Trusted Contacts management — add/remove people who get notified during an SOS
- 📧 Automated welcome email on signup (via Nodemailer + Brevo SMTP)

---

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Socket.io-client
- Axios
- React Hot Toast

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- Socket.io
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing
- Cloudinary for image storage
- Nodemailer (Brevo SMTP) for transactional emails

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Project Structure

```
chat-app-main/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # SideBar, ChatContainer, RightSidebar, SosButton
│   │   ├── pages/           # HomePage, LoginPage, ProfilePage, TrustedContactsPage
│   │   ├── lib/              # Utility functions
│   │   └── App.jsx
│   └── contex/               # AuthContext, ChatContext
│
└── server/                   # Express backend
    ├── controllers/          # auth, message, sos, trusted contact logic
    ├── routes/                # API route definitions
    ├── models/                # User, Message, SOSAlert, TrustedContact schemas
    ├── middleware/            # JWT auth middleware
    ├── lib/                    # DB connection, Cloudinary config, email helpers
    └── server.js               # App entry point + Socket.io setup
```

---

## How It Works

### Real-time messaging
Each user's socket connection is tracked with their user ID in an in-memory map on the server. When a message is sent, the server looks up the receiver's active socket and emits the message directly to them — enabling instant delivery without polling or page refresh.

### SOS Alert flow
1. User taps the SOS button → browser's Geolocation API captures their current coordinates.
2. Coordinates are sent to the backend, which creates an SOS alert record.
3. The backend checks each trusted contact:
   - If they're currently online, they receive an instant Socket.io notification.
   - Regardless of online status, they also receive an email with a direct link to the sender's location on Google Maps.

---

## Getting Started (Local Setup)

**1. Clone the repo**
```bash
git clone https://github.com/singhkunall/chat-app.git
cd chat-app-main
```

**2. Install dependencies**
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

**3. Set up environment variables**

Create a `.env` file in `server/`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
PORT=5000
```

Create a `.env` file in `client/`:
```
VITE_BACKEND_URL=http://localhost:5000
```

**4. Run the app**
```bash
# Backend
cd server
npm run dev

# Frontend (in a new terminal)
cd client
npm run dev
```

---

## Future Improvements

- Continuous live-location updates during an active SOS alert (currently a one-time snapshot)
- Group chat support
- Message delivery/read receipts with timestamps
- Push notifications for mobile

---

## Author

**Kunal Singh**
[GitHub](https://github.com/singhkunall)
