const cheerio = require('cheerio');

async function run() {
  const res = await fetch('https://nec.edu.in/cse-faculty/');
  const html = await res.text();
  const $ = cheerio.load(html);

  // We need to look at how names, designations and emails are placed.
  // A common way is to find elements containing "Assistant Professor" or "Associate Professor"
  // Let's just find all h2, h3, h4, h5, p elements that have text, and print the first 50 lines.

  const textBlocks = [];
  $('*').each((i, el) => {
    // Only grab elements that directly contain text (like headers, paragraphs, span inside table)
    // To simplify, let's extract all tables if any, or class names like 'team', 'faculty'.
  });
  
  // Actually, we can just grab all text and print it, but let's try to find elements with email addresses
  const emails = [];
  $('a[href^="mailto:"]').each((i, el) => {
      emails.push({
          email: $(el).text().trim() || $(el).attr('href').replace('mailto:', ''),
          parentText: $(el).parent().text().trim(),
          grandParentText: $(el).parent().parent().text().trim().substring(0, 100).replace(/\n/g, ' ')
      });
  });
  
  console.log("Found emails via mailto:");
  console.log(JSON.stringify(emails.slice(0, 10), null, 2));

  // Some pages don't use mailto. Let's also do a raw text regex search
  const allText = $('body').text();
  const rawEmails = allText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
  console.log("Raw emails found in text:", rawEmails ? rawEmails.slice(0, 10) : 'None');
}

run();
