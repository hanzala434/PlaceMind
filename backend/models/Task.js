const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  title: String,
  location: { lat: Number, lng: Number },
  radius: { type: Number, default: 100 },
  alertType: { type: String, enum: ['notification', 'call', 'both'] },
  userId: String,
  completed: { type: Boolean, default: false }
});
module.exports = mongoose.model('Task', TaskSchema);
