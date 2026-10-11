const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');
const Parent = require('./models/Parent');
const User = require('./models/User');

const mockStudents = [
  // Add your new mock students here
];

const mockParents = [
  // Add your new mock parents here
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Student.deleteMany({});
  await Parent.deleteMany({});
  await User.deleteMany({ role: { $in: ['student', 'parent'] } });

  if (mockParents.length > 0) {
    // Insert Users for Parents
    const parentUsersToInsert = mockParents.map(parent => ({
      name: parent.name,
      email: parent.email,
      role: 'parent',
      isVerified: true
    }));
    const parentUsers = await User.insertMany(parentUsersToInsert);

    // Insert Parents
    const parentsToInsert = mockParents.map((parent, index) => ({
      ...parent,
      userId: parentUsers[index]._id
    }));
    const parents = await Parent.insertMany(parentsToInsert);

    if (mockStudents.length > 0) {
      // Insert Users for Students
      const studentUsersToInsert = mockStudents.map(student => ({
        name: student.name,
        email: student.email,
        role: 'student',
        isVerified: true
      }));
      const studentUsers = await User.insertMany(studentUsersToInsert);

      // Insert Students and link to Parents
      // Assuming each student links to the parent at the same index for now, or just default to the first parent
      const studentsToInsert = mockStudents.map((student, index) => ({
        ...student,
        userId: studentUsers[index]._id,
        parentId: parents[Math.min(index, parents.length - 1)]._id
      }));
      const students = await Student.insertMany(studentsToInsert);

      // Update Parents with Student references
      for (let i = 0; i < students.length; i++) {
        const parentIndex = Math.min(i, parents.length - 1);
        if (!parents[parentIndex].students) {
            parents[parentIndex].students = [];
        }
        parents[parentIndex].students.push(students[i]._id);
        await parents[parentIndex].save();
      }
    }
  }

  console.log('Successfully seeded students and parents!');
  mongoose.connection.close();
}

seed().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
