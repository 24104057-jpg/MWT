const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');
const ScholarshipApplication = require('../models/ScholarshipApplication');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');

// 1. Tutor adds a new scholarship
router.post('/', async (req, res) => {
  try {
    const { tutorUserId, name, amount, cgpaReq, attendanceReq, deadline, docs } = req.body;
    
    const tutor = await Tutor.findOne({ userId: tutorUserId });
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    const newScholarship = new Scholarship({
      tutorId: tutor._id,
      name,
      amount,
      cgpaReq,
      attendanceReq,
      deadline,
      docs
    });

    await newScholarship.save();
    res.status(201).json({ message: 'Scholarship added successfully', scholarship: newScholarship });
  } catch (error) {
    console.error('Error adding scholarship:', error);
    res.status(500).json({ error: 'Failed to add scholarship' });
  }
});

// 2. Get all scholarships (for students to view)
router.get('/', async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json(scholarships);
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({ error: 'Failed to fetch scholarships' });
  }
});

// 3. Student applies for a scholarship
router.post('/apply', async (req, res) => {
  try {
    const { studentUserId, scholarshipId } = req.body;
    
    const student = await Student.findOne({ userId: studentUserId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if already applied
    const existing = await ScholarshipApplication.findOne({ studentId: student._id, scholarshipId });
    if (existing) {
      return res.status(400).json({ error: 'You have already applied for this scholarship' });
    }

    const application = new ScholarshipApplication({
      studentId: student._id,
      scholarshipId
    });

    await application.save();
    res.status(201).json({ message: 'Applied successfully', application });
  } catch (error) {
    console.error('Error applying for scholarship:', error);
    res.status(500).json({ error: 'Failed to apply' });
  }
});

// 4. Get applications for a student
router.get('/student/:studentUserId/applications', async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.studentUserId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const applications = await ScholarshipApplication.find({ studentId: student._id }).populate('scholarshipId');
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// 5. Get applications for scholarships created by a specific tutor
router.get('/tutor/:tutorUserId/applications', async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ userId: req.params.tutorUserId });
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    // Find scholarships created by this tutor
    const scholarships = await Scholarship.find({ tutorId: tutor._id });
    const scholarshipIds = scholarships.map(s => s._id);

    const applications = await ScholarshipApplication.find({ scholarshipId: { $in: scholarshipIds } })
      .populate('scholarshipId')
      .populate('studentId', 'name roll cgpa');
      
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// 6. Update application status (Tutor selects or rejects)
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { status, tutorUserId } = req.body;
    if (!['selected', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const tutor = await Tutor.findOne({ userId: tutorUserId });
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    const application = await ScholarshipApplication.findById(req.params.id).populate('scholarshipId');
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.scholarshipId.tutorId.toString() !== tutor._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json({ message: `Application ${status}`, application });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
