const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
  name: { type: String, required: true },
  amount: { type: String, required: true },
  cgpaReq: { type: Number, required: true },
  attendanceReq: { type: Number, required: true },
  deadline: { type: Date, required: true },
  docs: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
