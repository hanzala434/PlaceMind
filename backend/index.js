const express = require('express');
const cors = require('cors');
const dotenv=require('dotenv').config();
const http = require('http');
const socketio = require('socket.io');
const app = express();
const connectDB = require('./config/db');
const server = http.createServer(app);
const User = require('./models/User');
const twilio = require('twilio');
const Task = require('./models/Task');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const io = socketio(server, {
  cors: {
     origin: "https://place-mind.vercel.app", // Allow requests from React frontend

    // origin: "http://localhost:3000", // Allow requests from React frontend
// <<<<<<< HEAD
//     // methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
//     // allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
// =======
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
// >>>>>>> fc525949000882d657ca5df0891019988db49c09
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

  const sentMessages = {};
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
  
        // Check if user is within the radius of any task
        const tasks = await Task.find(); // Replace with actual Task model
        tasks.forEach((task) => {
          const distance = getDistanceFromLatLonInMeters(
            location.latitude,
            location.longitude,
            task.location.lat,
            task.location.lng
          );
  
          if (distance <= (task.radius || 500)) {
            console.log(`User ${userId} is within radius of task ${task.title}`);
  
            if (!sentMessages[userId]) {
              sentMessages[userId] = [];
            }
            if (!sentMessages[userId].includes(task._id.toString())) {
              // Send SMS using Twilio
              try {
                client.messages.create({
                  body: `You are near the task: ${task.title}.`,
                  from: "whatsapp:+14155238886", // Twilio's WhatsApp Sandbox number
                  to: `whatsapp:${updatedUser.phone}`,
                });
                console.log(`Message sent to user ${userId} for task ${task.title}`);
  
                // Mark task as sent for this user
                sentMessages[userId].push(task._id.toString());
              } catch (error) {
                console.error('Error sending SMS:', error);
              }
            } else {
              console.log(`Message for task ${task.title} already sent to user ${userId}`);
            }
          }
        });
      } else {
        console.error(`User with ID ${userId} not found.`);
      }
  
      io.emit("receive-location", { id: socket.id, ...location });
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

// Helper function to calculate distance between two lat/lng points
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

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

// try {
//   const message = await client.messages.create({
//     body: `You have a task around: `,
//     messagingServiceSid: 'MGf96dc3f1ccea015c16edcbde4615b2c2',
//     from: process.env.TWILIO_NUMBER,
//     to: `${user.phone}`
    
//   });
//   console.log('Message sent:', message.sid);
// } catch (error) {
//   console.error('Error sending message:', error);
// }
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
