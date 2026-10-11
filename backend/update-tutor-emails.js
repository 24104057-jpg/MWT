const mongoose = require('mongoose');
const User = require('./models/User');
const Tutor = require('./models/Tutor');
require('dotenv').config();

const tutorEmails = [
  { search: /Sivakamasundari/i, newEmail: 'gsscse@nec.edu.in' },
  { search: /B\.?Shunmuga\s*Priya/i, newEmail: 'bsp@nec.edu.in' },
  { search: /S\.?Dheenathayalan/i, newEmail: 'ddhayalan@nec.edu.in' },
  { search: /D\.?VIJAYAKUMAR/i, newEmail: 'dvk@nec.edu.in' },
  { search: /K\.?Rajkumar/i, newEmail: 'rajkathir08@gmail.com' },
  { search: /D\.?Thamarai\s*Selvi/i, newEmail: 'dts-cse@nec.edu.in' },
  { search: /J\.?\s*Karthikeyan/i, newEmail: 'karthikeyan_cse@nec.edu.in' },
  { search: /Ida\s*Christy/i, newEmail: 'christy@nec.edu.in' },
  { search: /M\.?KANTHIMATHI/i, newEmail: 'kanthimathi_cse@nec.edu.in' },
  { search: /D\.?\s*Abisha/i, newEmail: 'abisha_cse@nec.edu.in' },
  { search: /VAZHAN\s*ARUL\s*SANTHIYA/i, newEmail: 'santhiya-cse@nec.edu.in' },
  { search: /R\.?Navedha\s*Evanjalin/i, newEmail: 'navedha-cse@nec.edu.in' },
  { search: /LINCY\s*A|A\.?Lincy/i, newEmail: 'lincy-cse@nec.edu.in' },
  { search: /S\.?G\.?\s*Janani\s*Ratthna/i, newEmail: 'janani-cse@nec.edu.in' },
  { search: /AMSAVENI\s*K|K\.?Amsaveni/i, newEmail: 'amsaveni-cse@nec.edu.in' },
  { search: /G\.?\s*PAVITHRA/i, newEmail: 'csepavithra@nec.edu.in' },
  { search: /KAYATHRI\s*S|S\.?Kayathri/i, newEmail: 'kayathricse@nec.edu.in' },
  { search: /A\.?RAJALAKSHMI/i, newEmail: 'rajalakshmicse@nec.edu.in' },
  { search: /R\.?Sandhiya/i, newEmail: 'sandhiyacse@nec.edu.in' },
  { search: /RAJESWARI\.?\s*T|T\.?Rajeswari/i, newEmail: 'rajeswaricse@nec.edu.in' },
  { search: /MAHESWARI\s*V|V\.?Maheswari/i, newEmail: 'vmahescse@nec.edu.in' },
  { search: /M\.?\s*N\.?\s*Rathina\s*Prabha/i, newEmail: 'rathinacse@nec.edu.in' },
  { search: /G\.?Anitha/i, newEmail: 'anithacse@nec.edu.in' },
  { search: /M\.?Vaijayanthimala/i, newEmail: 'vjmcse@nec.edu.in' }
];

async function updateTutors() {
  await mongoose.connect(process.env.MONGO_URI);
  
  for (const t of tutorEmails) {
    const users = await User.find({ name: t.search, role: 'tutor' });
    if (users.length === 1) {
      const user = users[0];
      const oldEmail = user.email;
      
      // Update User collection
      user.email = t.newEmail;
      user.password = 'tech@123';
      await user.save();
      
      // Update Tutor collection
      await Tutor.findOneAndUpdate({ userId: user._id }, { email: t.newEmail });
      
      console.log(`Updated: ${user.name} | ${oldEmail} -> ${t.newEmail}`);
    } else if (users.length === 0) {
      console.log(`NOT FOUND: ${t.search}`);
    } else {
      console.log(`MULTIPLE FOUND FOR: ${t.search} -> `, users.map(u => u.name));
    }
  }
  
  process.exit(0);
}

updateTutors().catch(console.error);
