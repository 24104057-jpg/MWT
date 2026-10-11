const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('page.html', 'utf8');
const $ = cheerio.load(html);

// Find the container that holds a profile-designation.
// usually it's in a card or div.
const cards = [];

$('.profile-designation, .designation, h1, h2, h3, h4, h5, p').each((i, el) => {
    const text = $(el).text().trim();
    if (text.includes('Assistant Professor') || text.includes('Associate Professor')) {
        const parent = $(el).parent().parent();
        cards.push(parent.html());
    }
});

console.log("First card HTML:");
console.log(cards[0]);
