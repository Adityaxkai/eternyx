const fs = require('fs');
const path = require('path');

function getJpegSize(buffer) {
  let i = 2; // skip SOI marker (FFD8)
  while (i < buffer.length) {
    if (buffer[i] !== 0xFF) {
      break; // error
    }
    const marker = buffer[i + 1];
    if (marker === 0xD9) {
      break; // EOI
    }
    
    const length = buffer.readUInt16BE(i + 2);
    
    // Start of Frame marker (SOF0 = 0xC0, SOF2 = 0xC2)
    if (marker === 0xC0 || marker === 0xC2) {
      const height = buffer.readUInt16BE(i + 5);
      const width = buffer.readUInt16BE(i + 7);
      return { width, height };
    }
    
    i += 2 + length;
  }
  return null;
}

const imageDir = path.join(__dirname, '..', 'public', 'images');
const images = ['wide-lineup.png', 'wide-close.png', 'wide-abstract.png'];

images.forEach(imgName => {
  const filePath = path.join(imageDir, imgName);
  if (fs.existsSync(filePath)) {
    const buffer = fs.readFileSync(filePath);
    const size = getJpegSize(buffer);
    if (size) {
      console.log(`${imgName}: size=${size.width}x${size.height}, format=JPEG`);
    } else {
      console.log(`${imgName}: Failed to read JPEG dimensions`);
    }
  } else {
    console.log(`${imgName}: NOT FOUND`);
  }
});
