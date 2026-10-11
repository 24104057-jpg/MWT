const mongoose = require('mongoose');
const User = require('./models/User');
const Tutor = require('./models/Tutor');
const Student = require('./models/Student');
require('dotenv').config();

const merges = [
  { oldEmail: 'bshunmugapriya@nec.edu.in', newEmail: 'bsp@nec.edu.in' },
  { oldEmail: 'krajkumar@nec.edu.in', newEmail: 'krk@nec.edu.in' },
  { oldEmail: 'jidachristy@nec.edu.in', newEmail: 'jic@nec.edu.in' },
  { oldEmail: 'arajalakshmi@nec.edu.in', newEmail: 'arl@nec.edu.in' },
  { oldEmail: 'alincy@nec.edu.in', newEmail: 'al@nec.edu.in' },
  { oldEmail: 'rsandhiya@nec.edu.in', newEmail: 'rs@nec.edu.in' },
  { oldEmail: 'sgjananiratthna@nec.edu.in', newEmail: 'sgj@nec.edu.in' },
  { oldEmail: 'rnavedhaevanjalin@nec.edu.in', newEmail: 'rne@nec.edu.in' }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  
  for (const merge of merges) {
    const oldUser = await User.findOne({ email: merge.oldEmail });
    const newUser = await User.findOne({ email: merge.newEmail });
    
    if (oldUser && newUser) {
      const oldTutor = await Tutor.findOne({ userId: oldUser._id });
      const newTutor = await Tutor.findOne({ userId: newUser._id });
      
      if (oldTutor && newTutor) {
        // Move students to the old tutor
        oldTutor.students = newTutor.students;
        await oldTutor.save();
        
        // Remove the duplicate new tutor and user
        await Tutor.deleteOne({ _id: newTutor._id });
        await User.deleteOne({ _id: newUser._id });
        
        console.log(`Merged ${merge.newEmail} into ${merge.oldEmail}`);
      }
    } else {
      console.log(`Skipped ${merge.newEmail} -> ${merge.oldEmail}`);
    }
  }
  
  process.exit(0);
}

run().catch(console.error);
