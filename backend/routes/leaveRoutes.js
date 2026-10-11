const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');

// Create a new leave request (Student)
router.post('/', async (req, res) => {
  try {
    const { studentUserId, reason, startDate, endDate } = req.body;

    // Find the student by userId
    const student = await Student.findOne({ userId: studentUserId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find the tutor assigned to this student
    const tutor = await Tutor.findOne({ students: student._id });
    if (!tutor) {
      return res.status(404).json({ error: 'No tutor assigned to this student' });
    }

    const newLeave = new LeaveRequest({
      studentId: student._id,
      tutorId: tutor._id,
      reason,
      startDate,
      endDate
    });

    await newLeave.save();
    res.status(201).json({ message: 'Leave request submitted successfully', leave: newLeave });
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ error: 'Failed to submit leave request', details: error.message });
  }
});

// Get all leave requests for a specific student
router.get('/student/:studentUserId', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.studentUserId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const leaves = await LeaveRequest.find({ studentId: student._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching student leaves:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

// Get all leave requests for a specific tutor's students
router.get('/tutor/:tutorUserId', async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ userId: req.params.tutorUserId });
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    const leaves = await LeaveRequest.find({ tutorId: tutor._id }).populate('studentId', 'name roll').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching tutor leaves:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

// Update leave request status (Tutor)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, tutorUserId } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const tutor = await Tutor.findOne({ userId: tutorUserId });
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (leave.tutorId.toString() !== tutor._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this leave request' });
    }

    leave.status = status;
    await leave.save();

    res.json({ message: `Leave request ${status}`, leave });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ error: 'Failed to update leave status' });
  }
});

module.exports = router;
