/**
 * This script ensures that critical image files exist in the necessary directories
 */
const fs = require('fs');
const path = require('path');

console.log('🖼️ Ensuring critical image files exist...');

// Paths to check and create
const directories = [
  'medicinesImages',
  'client/public/images/medicines',
  'server/uploads'
];

// Ensure directories exist
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create a default "no-image.jpg" if it doesn't exist
const createNoImageJpg = (targetDir) => {
  const targetPath = path.join(targetDir, 'no-image.jpg');
  
  // Check if file already exists
  if (fs.existsSync(targetPath)) {
    console.log(`✅ ${targetPath} already exists`);
    return;
  }
  
  // Find an existing no-image.jpg to copy
  for (const dir of directories) {
    const sourcePath = path.join(dir, 'no-image.jpg');
    if (fs.existsSync(sourcePath)) {
      console.log(`Found source image at ${sourcePath}, copying to ${targetPath}`);
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Created ${targetPath}`);
      return;
    }
  }
  
  // If no existing file found, create a simple placeholder
  console.log(`Creating placeholder image at ${targetPath}`);
  
  // This is a minimal valid JPEG file as a placeholder
  const minimalJpeg = Buffer.from([
    0xFF, 0xD8,                    // SOI marker
    0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, // JFIF header
    0xFF, 0xDB, 0x00, 0x43, 0x00,  // DQT marker
    // Remaining bytes for a minimal JPEG file - quality table and minimal image data
    0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01, 0x00, 0x01, 0x03, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, // SOF marker
    0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0A, // DHT marker
    0xFF, 0xDA, 0x00, 0x0C, 0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xD9 // SOS marker and EOI marker
  ]);
  
  fs.writeFileSync(targetPath, minimalJpeg);
  console.log(`✅ Created minimal placeholder at ${targetPath}`);
};

// Ensure no-image.jpg exists in all needed directories
directories.forEach(dir => {
  createNoImageJpg(dir);
});

console.log('✅ Image verification complete'); 