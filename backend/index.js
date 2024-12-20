const express = require('express');
const cors = require('cors');
const dotenv=require('dotenv').config();
const http = require('http');
const socketio = require('socket.io');
const app = express();
const connectDB = require('./config/db');
const server = http.createServer(app);
const User = require('./models/User');
const io = socketio(server, {
  cors: {
    //https://place-mind-qa3v.vercel.app/
    origin: "https://place-mind.vercel.app", // Allow requests from React frontend

    //origin: "http://localhost:3000", // Allow requests from React frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  },
});

connectDB();
app.use(cors()); // Allow CORS for API routes
app.use(express.json());

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("send-location", (data) => {
//     io.emit("receive-location", { id: socket.id, ...data });
//     console.log("sent");
//     console.log(socket.id);

//   });

//   socket.on("disconnect", () => {
//     io.emit("user-disconnected", socket.id);
//   });
// });

const userSockets = {}; // In-memory store to map socket.id to userId

io.on("connection", (socket) => {
  console.log("A user connected with ID:", socket.id);

  // Associate socket.id with userId
  socket.on("register-user", async (userId) => {
    userSockets[socket.id] = userId;
    console.log(`User ${userId} associated with socket ${socket.id}`);
  });

  // Handle location updates
  socket.on("send-location", async (location) => {
    const userId = userSockets[socket.id]; // Get userId from socket.id
    if (!userId) {
      console.error(`No user associated with socket ID ${socket.id}`);
      return;
    }

    try {
      // Update the user's homeLocation in the database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { homeLocation: location }, // Update homeLocation
        { new: true } // Return the updated document
      );

      if (updatedUser) {
        console.log(`Updated homeLocation for user ${userId}:`, location);
      } else {
        console.error(`User with ID ${userId} not found.`);
      }

      io.emit("receive-location", { id: socket.id, ...location });
    console.log("sent");
    console.log(socket.id);
    } catch (error) {
      console.error("Error updating homeLocation:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSockets[socket.id]; // Remove socket mapping
  });
});

//routes
app.use('/api/users',require('./Routes/UserRoutes'));
app.use('/api/tasks',require('./Routes/TaskRoutes'));


// Download the helper library from https://www.twilio.com/docs/node/install
// const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// async function createCall() {
//   const call = await client.calls.create({
//     from: "+17855724931",
//     to: "+923185323731",
//     twiml: "<Response><Say>Ahoy, World!</Say></Response>",
//   });

//   console.log(call.sid);
// }

// createCall();

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
