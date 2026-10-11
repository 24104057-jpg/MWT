const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
require('dotenv').config();

const rawData = `
24104001	Gomathi S
24104002	Mathan Kumar.B
24104003	Subhasree G B
24104005	T.hareni
24104007	Shanmugapriyan P
24104009	S.Neha
24104010	S. Sivasankari
24104012	Sathiya Janani S
24104013	S.Aishwarya
24104016	Bhavana Lakshmi G
24104017	Karthika. J
24104018	Gowri latha V
24104019	JhananiKrishna S
24104020	Birundha c
24104021	Regaa
24104022	Renukha devi S
24104023	Balasubramaniyam A
24104024	Dhessiha.L
24104026	Sreeram.R.G
24104027	M.Lakshmana Perumal
24104028	Muthu Naveen N
24104029	Sridharan.k
24104031	Subhasree P
24104034	Mokshitha Shree.L
24104042	Amitesh.R
24104043	HARI MUTHU GANESH R
24104044	REYA IMMACULATE X
24104045	C HARINI
24104046	LAKSHMIGAYATHRI S
24104047	Srimathi Bala R M
24104049	MONISHA P
24104050	R SOWNDARYA
24104053	LOGANAYAGI V
24104055	RAJESWARI R
24104056	Vignesh Dharshan R 
24104057	ESAKKIMUTHU M 
24104058	LAKSHMI PRIYA K
24104060	ROSITA ANICIA. G
24104061	R Reena
24104062	JAYASRI C
24104063	THANUJA DEVI A
24104064	INIYAN A
24104066	HARINI KASI T
24104067	JEYA KIRTHIKA V
24104068	SANJULA S
24104069	LAVANYA M
24104070	SUDHARSAN K
24104072	KARPAGAVALLI A
24104074	Guru Sanjitha P
24104075	Kuttiammal M  
24104076	SIVA SANTHIYA M
24104079	KARTHIKA R R
24104081	Saumya.S
24104082	SHERLIN S
24104083	SOUNDARYA P
24104084	AFROSE NISHA A
24104089	Mageswari K
24104090	A.Valar Mathi
24104091	Brightton M
24104093	ANUSHIYA S
24104095	Swathi C
24104096	Dheiva lakshmi. T
24104097	ABINAYA R
24104098	Manasha
24104100	PRIYA M
24104102	M.Malathi
24104103	GANGA DEVI P
24104105	ESAKKI DURAI M
24104106	Jayasanthiya M
24104107	ARAVIND C
24104108	KAVINIYAA A.S 
24104109	LAVANNYAA S
24104110	VISWA M
24104112	Prisca M
24104113	Lavanya S
24104114	JYOTIR LEHA R
24104115	RAHESH L
24104116	MOHAN R
24104117	Devansh Chouhan
24104119	NICKSON KUMAR D 
24104120	HARIHARASUDHAN.M
24104121	Akilanethran.R
24104122	Nevesa AXD
24104123	Santhosha S
24104125	Raghavan P
24104004	Murali Subbiah M
24104125	Raghavan P
24104126	Yogaraj S
24104036	BHAVITHRAN M
24104004	Murali Subbiah M
24104008	Balagurunathan.H
24104030	Keerthana G
24104036	BHAVITHRAN M 
24104106	Jayasanthiya M
24104031	Subhasree P
24104033	Chenna krishnan S
24104054	Pandiarajan B
24104001	Gomathi S
24104002	Mathan Kumar.B
24104003	Subhasree G B
24104005	T.hareni
24104006	Milton joshwa 
24104007	Shanmugapriyan P
24104009	S.Neha
24104010	S. Sivasankari
24104011	KARTHIKEYAN S
24104012	Sathiya Janani S
24104013	S.Aishwarya
24104014	Sanjay A
24104015	Asmitha S
24104016	Bhavana Lakshmi G
24104017	Karthika. J
24104018	Gowri latha V
24104019	JhananiKrishna S
24104020	Birundha c
24104021	Regaa
24104022	Renukha devi S
24104024	Dhessiha.L
24104025	S.Nithish sankara narayanan
24104034	Mokshitha Shree.L
24104038	Srimuthuvel. S
24104038	Srimuthuvel. S
24104040	Maria Anto santhosh.A
24104041	Harishankar S
24104044	REYA IMMACULATE X
24104045	C HARINI
24104046	LAKSHMIGAYATHRI S
24104047	Srimathi Bala R M
24104048	Syed Sufyan M
24104049	MONISHA P
24104050	R SOWNDARYA
24104051	SARATHI KAMAL N
24104052	L KARTHIKA
24104053	LOGANAYAGI V
24104055	RAJESWARI R
24104056	Vignesh Dharshan R 
24104057	ESAKKIMUTHU M
24104058	LAKSHMI PRIYA K
24104059	Haris P A
24104061	R.Reena
24104062	JAYASRI C
24104060	ROSITA ANICIA G
24104063	THANUJA DEVI A 
24104065	VIGNESHWARA BAALAN P
24104066	HARINI KASI T
24104067	JEYA KIRTHIKA V
24104068	SANJULA S
24104069	LAVANYA M
24104071	S. SRI SELVA HARITHAA 
24104072	KARPAGAVALLI A
24104073	ANU RAHINI M
24104074	Guru Sanjitha P
24104075	Kuttiammal M
24104076	SIVA SANTHIYA M
24104078	SUPRIYA S
24104079	KARTHIKA R R
24104080	PRAVIN N
24104081	Saumya.S
24104082	SHERLIN S
24104083	SOUNDARYA P
24104084	AFROSE NISHA A
24104085	B HARIRAAM
24104086	M.Kaamesh
24104087	Afzal Ali K A H
24104088	Abdul Mufeed S
24104089	Mageswari K
24104090	A.Valar Mathi
24104091	Brightton M
24104092	Samuel R
24104093	ANUSHIYA S
24104094	DHARIQ ANVAR J
24104095	Swathi C
24104096	Dheiva lakshmi. T
24104097	ABINAYA R
24104098	Manasha
24104099	MOHANAPRIYA M
24104100	PRIYA M
24104101	Karthick Selvam S
24104102	M.Malathi
24104103	GANGA DEVI P
24104104	Mohamed A
24104105	ESAKKI DURAI M
24104107	ARAVIND C
24104108	KAVINIYAA A.S 
24104109	LAVANNYAA S
24104110	VISWA M
24104111	Himachalam.C
24104112	Prisca M
24104113	Lavanya S
24104114	JYOTIR LEHA R
24104115	RAHESH L
24104116	MOHAN R
24104117	Devansh Chouhan
24104118	ANUSHIYA SELVI M
24104119	NICKSON KUMAR D 
24104120	HARIHARASUDHAN.M
24104121	Akilanethran.R
24104122	Nevesa AXD
24104123	Santhosha S
24104124	Vishwa Meera N M
24104126	Yogaraj S
24104127	THARUN K.S
24104401	SATHEESHKUMAR M
24104402	CHINNATHAMBI V
24104001	Gomathi S 
24104002	Mathan Kumar B 
24104002	Mathan Kumar B 
24104003	Subhasree G B
24104004	Murali Subbiah  M
24104004	Murali Subbiah M
24104005	T.Hareni
24104005	T.Hareni
24104006	Milton Joshwa P
24104007	Shanmugapriyan P
	Balagurunathan H
	Balagurunathan H
24104009	Neha S
24104010	Sivasankari S
24104011	KarthiKeyan S 
24104011	KarthiKeyan S 
24104012	Sathiya Janani S
24104012	Sathiya Janani S
24104013	 Aishwarya S
24104014	Sanjay A
24104014	sanjay A
24104015	Asmitha S 
24104016	Bhavana Lakshmi G 
24104017	Karthika J 
24104017	Karthika J 
24104018	Gowri Latha V 
24104018	Gowri Latha V 
24104019	Jhanani Krishna S 
24104020	Birundha C 
24104021	Regaa G
24104021	Regaa G
24104022	Renukha devi S
24104022	Renukha devi S
24104023	Balasubramaniyam A
24104024	Dhessiha L
24104025	Nithish Sankara Narayanan S 
24104025	Nithish Sankara Narayanan S 
24104026	Sreeram R G
24104026	Sreeram R G
24104027	Lakshmana Perumal
24104028	Muthu Naveen N 
24104028	Muthu Naveen N 
24104029	Sridharan K
24104031	Subhasree P
24104033	Chennakrishnan S
24104034	Mokshitha Shree L 
24104035	Prajith S
24104035	Prajith S
24104036	Bhavithran M
24104037	Sathasivam M S
24104037	Sathasivam M S
24104038	Srimuthuvel S
24104038	Srimuthuvel S
24104039	Tharun G
24104039	Tharun G
24104039	Tharun G
24104040	Maria Anto Santhosh.A
	
24104041	Harishankar S
24104041	Harishankar S
24104042	Amitesh R
24104042	Amitesh R
24104043	Hari Muthu Ganesh R
24104044	Reya Immaculate X 
24104048	Syed Sufyan M
24104050	Sowndarya R
24104051	Sarathi Kamal N
24104053	Loganayagi V
24104054	PANDIARAJAN B
24104056	Vigneshdharshan R
24104057	ESAKKIMUTHU M
24104058	Lakshmi priya K
24104065	Vigneshwara Baalan P 
24104065	Vigneshwara Baalan P 
24104059	Haris P A
24104064	Iniyan A
24104064	Iniyan A
24104066	Harini Kasi T
24104070	Sudharsan k
24104076	Sivasanthiya M
24104078	Supriya S 
24104079	Karthika R R
24104080	Pravin N
24104080	Pravin N
24104081	Saumya S 
24104083	Soundarya P
24104085	B HARIRAAM
24104085	B HARIRAAM
24104086	Kaamesh M
24104086	Kaamesh M
24104087	Afzal Ali K A H
24104088	Abdul Mufeed S
24104088	Abdul Mufeed S
24104089	Mageswari K
24104090	A . Valar Mathi
24104091	Brightton M
24104091	Brightton M
24104092	Samuel R
24104093	Anushiya S 
24104094	Dhariq Anvar J
24104095	Swathi C
24104095	Swathi C
24104096	Dheiva Lakshmi T
24104096	Dheiva Lakshmi T
24104098	MANASHA K
24104099	Mohanapriya M 
24104100	PRIYA M
24104100	PRIYA M
24104101	Karthick Selvam S
24104102	Malathi M
24104103	Ganga Devi P
24104103	Ganga Devi P
24104104	Mohamed A
24104105	Esakki Durai M
24104106	Jayasanthiya M 
24104107	Aravind C
24104108	Kaviniyaa A S
24104108	Kaviniyaa A S
24104109	Lavannyaa S
24104110	Viswa M
24104111	Himachalam C
24104111	Himachalam C
24104112	Prisca M 
24104113	Lavanya S 
24104113	Lavanya S 
24104114	Jyotir Leha R
24104115	Rahesh L
24104116	Mohan R
24104116	Mohan R
24104116	Mohan R
24104117	Devansh Chouhan
24104117	Devansh Chouhan
24104118	Anushiya Selvi M
24104118	Anushiya Selvi M
24104119	Nickson Kumar D
24104119	Nickson Kumar D
24104120	HariHaraSudhan M
24104121	Akilanethran R
24104121	Akilanethran R
24104122	Nevesa AXD
24104122	Nevesa AXD
24104123	Santhosha S
24104123	Santhosha S
24104124	Vishwa Meera N M
24104124	Vishwa Meera N M
24104125	Raghavan P
24104125	Raghavan P
24104126	Yogaraj S
24104126	Yogaraj S
24104127	Tharun k.s
24104127	Tharun k.s
24104401	SATHEESHKUMAR M
24104401	SATHEESHKUMAR M
24104402	Chinnathambi V 
24104402	Chinnathambi V 
24104403	SIVA SUTHARSANAN G
24104403	SIVA SUTHARSANAN G
24104404	Sri Rooba P 
24104404	Sri Rooba P 
24104404	Sri Rooba P 
24104405	DINESH M
24104405	DINESH M
24104406	VENKATESH M 
24104406	VENKATESH M 
24104407	SANJAIKUMAR N
24104407	SANJAIKUMAR N
`;

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const lines = rawData.split('\n');
  const studentsMap = new Map();

  lines.forEach(line => {
    const match = line.trim().match(/^(\d+)\s+(.+)$/);
    if (match) {
      const roll = match[1];
      const name = match[2].trim();
      studentsMap.set(roll, name);
    }
  });

  const studentsToInsert = [];
  const usersToInsert = [];

  studentsMap.forEach((name, roll) => {
    const email = `${roll}@nec.edu.in`;
    studentsToInsert.push({
      name,
      roll,
      email,
      dept: 'Computer Science',
      sem: 1
    });
    usersToInsert.push({
      name,
      email,
      password: 'nec@123',
      role: 'student',
      isVerified: true
    });
  });

  console.log(`Found ${studentsToInsert.length} unique students to insert.`);

  // Clear existing students
  await Student.deleteMany({});
  await User.deleteMany({ role: 'student' });

  // Insert Users first
  const insertedUsers = await User.insertMany(usersToInsert);
  
  // Link User IDs
  for (let i = 0; i < studentsToInsert.length; i++) {
    studentsToInsert[i].userId = insertedUsers[i]._id;
  }

  await Student.insertMany(studentsToInsert);

  console.log('Successfully seeded students!');
  process.exit(0);
}

seed().catch(console.error);
