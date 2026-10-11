const cheerio = require('cheerio');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Tutor = require('./models/Tutor');
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const html = fs.readFileSync('page.html', 'utf8');
  const $ = cheerio.load(html);

  const tutorsToInsert = [];
  const usersToInsert = [];

  $('.profile-body').each((i, el) => {
    const title = $(el).find('.profile-title').text().trim();
    const designation = $(el).find('.profile-designation').text().trim();

    if ((designation.includes('Assistant Professor') || designation.includes('Associate Professor')) && 
        !designation.match(/^Professor$/) && 
        !designation.includes('Head')) {
      
      // Clean name: remove Dr., Mr., Ms.
      let cleanName = title.replace(/^(Dr\.|Mr\.|Ms\.)\s*/i, '');
      
      // Generate email
      let emailPrefix = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `${emailPrefix}@nec.edu.in`;

      tutorsToInsert.push({
        name: title,
        email: email,
        dept: 'Computer Science', // from URL
        subjects: []
      });

      usersToInsert.push({
        name: title,
        email: email,
        role: 'tutor',
        isVerified: true
      });
    }
  });

  // Ensure unique emails
  const uniqueTutors = [];
  const uniqueUsers = [];
  const seenEmails = new Set();
  for(let i = 0; i < tutorsToInsert.length; i++) {
     if(!seenEmails.has(tutorsToInsert[i].email)) {
         seenEmails.add(tutorsToInsert[i].email);
         uniqueTutors.push(tutorsToInsert[i]);
         uniqueUsers.push(usersToInsert[i]);
     }
  }

  console.log(`Found ${uniqueTutors.length} tutors. Inserting...`);
  
  // Optionally clear existing
  await Tutor.deleteMany({});
  // We won't clear Users entirely, maybe just tutors
  await User.deleteMany({ role: 'tutor' });

  // Insert Users first to get IDs
  const insertedUsers = await User.insertMany(uniqueUsers);
  
  // Link User IDs to Tutors
  for(let i=0; i<uniqueTutors.length; i++) {
     uniqueTutors[i].userId = insertedUsers[i]._id;
  }

  await Tutor.insertMany(uniqueTutors);

  console.log('Successfully seeded tutors!');
  mongoose.connection.close();
}

seed().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
