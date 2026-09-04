const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, '../public/videos');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const file = fs.createWriteStream(path.join(dir, 'reel-placeholder.mp4'));

const url = 'https://www.w3schools.com/html/mov_bbb.mp4';

console.log('Downloading tiny video placeholder...');
https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('✓ Tiny placeholder video downloaded to public/videos/reel-placeholder.mp4');
  });
}).on('error', (err) => {
  fs.unlinkSync(path.join(dir, 'reel-placeholder.mp4'));
  console.error('Download failed:', err.message);
});
