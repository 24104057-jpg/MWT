const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  dept: { type: String },
  sem: { type: Number },
  cgpa: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'warning', 'inactive'], default: 'active' },
  roll: { type: String, required: true, unique: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
