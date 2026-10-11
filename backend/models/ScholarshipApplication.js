const mongoose = require('mongoose');

const scholarshipApplicationSchema = new mongoose.Schema({
  scholarshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['applied', 'selected', 'rejected'], default: 'applied' }
}, { timestamps: true });

module.exports = mongoose.model('ScholarshipApplication', scholarshipApplicationSchema);
