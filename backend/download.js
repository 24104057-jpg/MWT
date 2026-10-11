const fs = require('fs');

async function run() {
  const res = await fetch('https://nec.edu.in/cse-faculty/');
  const html = await res.text();
  fs.writeFileSync('page.html', html);
  console.log("Saved page.html");
}

run();
