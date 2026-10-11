const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');
const Parent = require('../models/Parent');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let dept = '';
    let studentsCount = 0;
    let roll = '';
    let sem = '';

    if (user.role === 'tutor') {
      const tutor = await Tutor.findOne({ userId: user._id });
      if (tutor) {
        dept = tutor.dept || 'Computer Science';
        // For now, if tutor has students array we count them, else 0
        studentsCount = tutor.students ? tutor.students.length : 0;
      }
    } else if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        dept = student.dept;
        roll = student.roll;
        sem = student.sem;
      }
    } else if (user.role === 'admin') {
      dept = 'University Administration';
    } else if (user.role === 'parent') {
      dept = 'Parent';
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      dept,
      studentsCount,
      roll,
      sem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Add a new user (student or tutor)
router.post('/add', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    if (!['student', 'tutor'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either student or tutor' });
    }

    const newUser = new User({ name, email, role });
    await newUser.save();
    
    res.status(201).json({ message: `${role} added successfully`, user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user', details: error.message });
  }
});

// Verify a user
router.put('/verify/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User verified successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify user', details: error.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Get students for a tutor
router.get('/tutor/:userId/students', async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ userId: req.params.userId }).populate('students');
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }
    res.json(tutor.students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get all tutors (for admin)
router.get('/tutors', async (req, res) => {
  try {
    const tutors = await Tutor.find();
    res.json(tutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch all tutors' });
  }
});

// Get all students (for admin)
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch all students' });
  }
});
// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    
    // Also update the corresponding role document so it reflects in dashboards
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (user.role === 'student') {
      await Student.findOneAndUpdate({ userId: user._id }, updateData);
    } else if (user.role === 'tutor') {
      await Tutor.findOneAndUpdate({ userId: user._id }, updateData);
    } else if (user.role === 'parent') {
      await Parent.findOneAndUpdate({ userId: user._id }, updateData);
    }
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
