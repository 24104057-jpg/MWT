const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Tutor = require('./models/Tutor');
require('dotenv').config();

const tutorsData = [
  { initials: 'BSP', name: 'B. Shanmugapriya', email: 'bsp@nec.edu.in' },
  { initials: 'KRK', name: 'K. Rajkumar', email: 'krk@nec.edu.in' },
  { initials: 'JIC', name: 'J. Idachristy', email: 'jic@nec.edu.in' },
  { initials: 'ARL', name: 'A. Rajalakshmi', email: 'arl@nec.edu.in' },
  { initials: 'AL', name: 'A. Lincy', email: 'al@nec.edu.in' },
  { initials: 'RS', name: 'R. Sandhiya', email: 'rs@nec.edu.in' },
  { initials: 'SGJ', name: 'S. G. Jananirathna', email: 'sgj@nec.edu.in' },
  { initials: 'RNE', name: 'R. Navedha Evanjalin', email: 'rne@nec.edu.in' },
];

const studentsData = `
AL	24104001	GOMATHI S
AL	24104002	MATHAN KUMAR B
AL	24104003	SUBHASREE G B
AL	24104004	MURALI SUBBIAH M
AL	24104005	HARENI T
SGJ	24104006	MILTON JOSHWA .P
SGJ	24104007	SHANMUGAPRIYAN P
SGJ	24104008	BALA GURUNATHAN H
SGJ	24104009	NEHA S
SGJ	24104010	SIVASANKARI S
JIC	24104011	KARTHIKEYAN S
JIC	24104012	SATHIYA JANANI S
JIC	24104013	AISHWARYA S
JIC	24104014	SANJAY A
JIC	24104015	ASMITHA S
RNE	24104016	BHAVANA LAKSHMI G
RNE	24104017	KARTHIKA J
RNE	24104018	GOWRI LATHA V
RNE	24104019	JHANANI KRISHNA S
RNE	24104020	BIRUNDHA C
KRK	24104021	REGAA G
KRK	24104022	RENUKHA DEVI S
KRK	24104023	BALASUBRAMANIYAM A
KRK	24104024	DHESSIHA L
KRK	24104025	NITHISH SANKARA NARAYANAN S
KRK	24104026	SREE RAM R G
RS	24104027	LAKSHMANA PERUMAL M
RS	24104028	MUTHU NAVEEN N
RS	24104029	SRIDHARAN K
RS	24104030	KEERTHANA G
ARL 	24104031	SUBHASREE P
ARL	24104033	CHENNA KRISHNAN S
ARL	24104034	MOKSHITHA SHREE L
ARL	24104035	PRAJITH S
ARL	24104036	BHAVITHRAN M
ARL	24104037	SATHASIVAM M S
ARL	24104038	SRIMUTHUVEL S
ARL	24104039	THARUN G
ARL	24104040	MARIA ANTO SANTHOSH A
BSP	24104041	HARISHANKAR S
BSP	24104042	AMITESH R
BSP	24104043	HARI MUTHU GANESH R
BSP	24104044	REYA IMMACULATE X
BSP	24104045	HARINI C
BSP	24104046	LAKSHMIGAYATHRI S
BSP	24104047	SRIMATHI BALA R M
BSP	24104048	SYED SUFYAN M
BSP	24104049	MONISHA P
BSP	24104050	SOWNDARYA R
BSP	24104051	SARATHI KAMAL N
BSP	24104052	KARTHIKA L
SGJ	24104053	LOGANAYAGI V
SGJ	24104054	PANDIARAJAN B
SGJ	24104055	RAJESWARI R
SGJ	24104056	VIGNESH DHARSHAN R
SGJ	24104057	ESAKKIMUTHU M
SGJ	24104058	LAKSHMI PRIYA K
SGJ	24104059	HARIS P A
SGJ	24104060	ROSITA ANICIA G
SGJ	24104061	REENA R
SGJ	24104062	JAYASRI C
SGJ	24104063	THANUJA DEVI A
SGJ	24104064	INIYAN A
ARL	24104065	VIGNESHWARA BAALAN P
ARL	24104066	HARINI KASI T
ARL	24104067	JEYA KIRTHIKA V
ARL	24104068	SANJULA S
ARL	24104069	LAVANYA M
JIC	24104070	SUDHARSAN K
JIC	24104071	SRI SELVA HARITHAA S
JIC	24104072	KARPAGAVALLI A
JIC	24104073	ANU RAHINI M
JIC	24104074	GURU SANJITHA P
JIC	24104075	KUTTIAMMAL M
JIC	24104076	SIVASANTHIYA M
KRK	24104078	SUPRIYA S
KRK	24104079	KARTHIKA RR
KRK	24104080	PRAVIN N
KRK	24104081	SAUMYA S
KRK	24104082	SHERLIN S
KRK	24104083	SOUNDARYA P
RS	24104084	AFROSE NISHA A
KRK	24104085	HARIRAAM B
KRK	24104086	KAAMESH M
KRK	24104087	AFZALALI KAH
KRK	24104088	ABDUL MUFEED S
JIC	24104089	MAGESWARI K
RS	24104090	VALAR MATHI A
RS	24104091	BRIGHTTON M
RS	24104092	SAMUEL R
RS	24104093	ANUSHIYA S
RS	24104094	DHARIQ ANVAR J
RS	24104095	SWATHI C
RS	24104096	DHEIVA LAKSHMI T
RS	24104097	ABINAYA R
RS	24104098	MANASHA K
RS	24104099	MOHANAPRIYA M
RS	24104100	PRIYA M
RS	24104101	KARTHICK SELVAM S
RS	24104102	MALATHI M
RS	24104103	GANGA DEVI P
RNE	24104104	MOHAMED A
RNE	24104105	M ESAKKI DURAI
RNE	24104106	JAYASANTHIYA M
RNE	24104107	ARAVIND C
RNE	24104108	KAVINIYAA A S
RNE	24104109	LAVANNYAA S
RNE	24104110	VISWA M
RNE	24104111	HIMACHALAM C
RNE	24104112	PRISCA M
RNE	24104113	LAVANYA S
RNE	24104114	JYOTIR LEHA R
RNE	24104115	RAHESH L
AL	24104116	MOHAN R
AL	24104117	DEVANSH CHOUHAN
AL	24104118	ANUSHIYA SELVI M
AL	24104119	NICKSON KUMAR D
AL	24104120	HARIHARASUDHAN M
AL	24104121	R AKILANETHRAN
AL	24104122	NEVESA A X D
AL	24104123	SANTHOSHA S
AL	24104124	VISHWA MEERA N M
AL	24104125	RAGHAVAN P
AL	24104126	YOGARAJ S
AL	24104127	THARUN K S
AL	24104401	SATHEESHKUMAR M
RNE	24104402	CHINNATHAMBI V
SGJ	24104403	SIVA SUTHARSANAN G
BSP	24104404	SRI ROOBA P
JIC	24104405	DINESH M
ARL	24104406	VENKATESH M
BSP	24104407	SANJAI KUMAR N
`;

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Insert tutors
  const tutorDocs = {};
  for (let t of tutorsData) {
    let user = await User.findOne({ email: t.email });
    if (!user) {
      user = await User.create({
        name: t.name,
        email: t.email,
        password: 'password', // Default tutor password
        role: 'tutor',
        isVerified: true
      });
    }
    
    let tutor = await Tutor.findOne({ email: t.email });
    if (!tutor) {
      tutor = await Tutor.create({
        userId: user._id,
        name: t.name,
        email: t.email,
        dept: 'Computer Science',
        students: []
      });
    } else {
      tutor.students = [];
      await tutor.save();
    }
    tutorDocs[t.initials] = tutor;
  }
  
  const lines = studentsData.trim().split('\n');
  const studentsToInsert = [];
  const usersToInsert = [];
  
  // Track unique to avoid inserting dupes
  const studentMap = new Map();

  for (let line of lines) {
    // Parse line. e.g. AL	24104001	GOMATHI S
    const parts = line.trim().split('\t');
    if (parts.length < 3) continue;
    
    let tutorInitials = parts[0].trim();
    let roll = parts[1].trim();
    let name = parts[2].trim();
    
    // Correct missing tutor initials
    if (roll === '24104026' && !tutorInitials) tutorInitials = 'KRK';
    if (roll === '24104029' && !tutorInitials) tutorInitials = 'RS';

    studentMap.set(roll, { name, roll, tutorInitials });
  }

  console.log(`Found ${studentMap.size} students to insert.`);

  // To be safe, clear old students 
  await Student.deleteMany({});
  await User.deleteMany({ role: 'student' });
  
  // Reset tutor student arrays
  for (let t in tutorDocs) {
    tutorDocs[t].students = [];
  }

  for (let [roll, data] of studentMap) {
    let email = `${roll}@nec.edu.in`;
    
    let user = await User.create({
      name: data.name,
      email: email,
      password: 'password', // default password
      role: 'student',
      isVerified: true
    });
    
    let student = await Student.create({
      userId: user._id,
      name: data.name,
      email: email,
      roll: roll,
      dept: 'Computer Science',
      sem: 1
    });
    
    if (tutorDocs[data.tutorInitials]) {
      tutorDocs[data.tutorInitials].students.push(student._id);
    }
  }

  // Save tutors
  for (let t in tutorDocs) {
    await tutorDocs[t].save();
    console.log(`Tutor ${tutorDocs[t].name} has ${tutorDocs[t].students.length} students`);
  }

  console.log('Successfully enrolled students and linked to tutors!');
  process.exit(0);
}

seed().catch(console.error);
