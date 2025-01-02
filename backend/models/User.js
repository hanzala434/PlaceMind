const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  preferredAlertType: { type: String, enum: ['notification', 'call', 'both'], default: 'notification' },
  homeLocation: {
    latitude: { type: Number ,default:0},
    longitude: { type: Number ,default:0},
  },
  defaultRadius: { type: Number, default: 100 },
  notificationEnabled: { type: Boolean, default: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
// isVerified: { type: Boolean, default: false },
// twoFactorEnabled: { type: Boolean, default: false },
// authProvider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profileImage: { type: String },
  settings: {
    darkMode: { type: Boolean, default: false },
    language: { type: String, default: 'en' }
  }
});

module.exports = mongoose.model('User', UserSchema);
