const fs = require('fs');
const path = require('path');

function getPngDimensions(buffer) {
  // PNG signature is 8 bytes. IHDR chunk starts at byte 12.
  // Width is at 16-19, Height is at 20-23 (32-bit big-endian integers)
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

function getJfifDimensions(buffer) {
  // JPEG/JFIF parser to find SOF0/SOF2 marker
  let i = 2;
  while (i < buffer.length) {
    const marker = buffer.readUInt16BE(i);
    i += 2;
    if (marker === 0xFFD8) continue;
    if (marker === 0xFFD9) break; // End of image
    
    // Segment size
    const size = buffer.readUInt16BE(i);
    
    // SOF0 (Start of Frame 0, baseline DCT) or SOF2 (Progressive DCT)
    // 0xFFC0 or 0xFFC2
    if (marker === 0xFFC0 || marker === 0xFFC2) {
      const height = buffer.readUInt16BE(i + 3);
      const width = buffer.readUInt16BE(i + 5);
      return { width, height };
    }
    i += size;
  }
  return null;
}

function getDimensions(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(100);
  fs.readSync(fd, buffer, 0, 100, 0);
  fs.closeSync(fd);

  // Check signature
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return { type: 'PNG', ...getPngDimensions(buffer) };
  } else if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    // Read a larger chunk for JPEGs since SOF might be further down
    const fullBuffer = fs.readFileSync(filePath);
    return { type: 'JPEG', ...getJfifDimensions(fullBuffer) };
  }
  return { type: 'UNKNOWN' };
}

const dir = 'y:/Eternyx/public/images';
const files = fs.readdirSync(dir);
console.log('Image dimensions in public/images:');
for (const file of files) {
  const fullPath = path.join(dir, file);
  if (fs.statSync(fullPath).isFile()) {
    try {
      const dims = getDimensions(fullPath);
      console.log(`- ${file}: ${dims.type} ${dims.width}x${dims.height}`);
    } catch (e) {
      console.log(`- ${file}: Error: ${e.message}`);
    }
  }
}
