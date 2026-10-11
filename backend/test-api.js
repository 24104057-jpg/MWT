const http = require('http');

const runTest = async () => {
  console.log('Testing the User API endpoints...\n');

  // Helper function to make requests
  const makeRequest = (options, postData) => {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        });
      });

      req.on('error', (e) => reject(e));

      if (postData) {
        req.write(JSON.stringify(postData));
      }
      req.end();
    });
  };

  try {
    // 1. Add a Student
    console.log('1. Adding a Student...');
    const studentData = { name: "Test Student", email: `student_${Date.now()}@test.com`, role: "student" };
    const studentRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/users/add',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, studentData);
    console.log('Response:', studentRes);
    
    let studentId;
    if (studentRes.user && studentRes.user._id) {
        studentId = studentRes.user._id;
    }

    console.log('\n----------------------------------------\n');

    // 2. Add a Tutor
    console.log('2. Adding a Tutor...');
    const tutorData = { name: "Test Tutor", email: `tutor_${Date.now()}@test.com`, role: "tutor" };
    const tutorRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/users/add',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, tutorData);
    console.log('Response:', tutorRes);

    console.log('\n----------------------------------------\n');

    // 3. Verify the Student
    if (studentId) {
        console.log(`3. Verifying the Student (ID: ${studentId})...`);
        const verifyRes = await makeRequest({
        hostname: 'localhost',
        port: 5000,
        path: `/api/users/verify/${studentId}`,
        method: 'PUT',
        });
        console.log('Response:', verifyRes);
    } else {
        console.log('Could not verify student because ID was not found. Is the server running?');
    }

    console.log('\n----------------------------------------\n');

    // 4. Get all users
    console.log('4. Fetching all users...');
    const allUsersRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/users',
      method: 'GET',
    });
    console.log(`Found ${Array.isArray(allUsersRes) ? allUsersRes.length : 0} users in the database.`);
    
  } catch (error) {
    console.error('Error during testing:', error.message);
    console.log('\nMake sure your backend server is running! (node server.js)');
  }
};

runTest();
