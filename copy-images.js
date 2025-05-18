/**
 * Script to copy all medicine images to required directories
 */
const fs = require('fs');
const path = require('path');

console.log('📋 Medicine Image Copy Tool 📋');
console.log('===============================');

// Define source and target directories
const sourceDir = path.join(__dirname, 'medicinesImages');
const targetDirs = [
  path.join(__dirname, 'client', 'public', 'images', 'medicines'),
  path.join(__dirname, 'server', 'uploads')
];

// Ensure target directories exist
targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Get all image files from source directory
console.log(`\nScanning source directory: ${sourceDir}`);
let imageFiles = [];

try {
  if (fs.existsSync(sourceDir)) {
    imageFiles = fs.readdirSync(sourceDir)
      .filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.png'));
    console.log(`Found ${imageFiles.length} image files in source directory`);
  } else {
    console.log(`Source directory ${sourceDir} does not exist`);
  }
} catch (err) {
  console.error(`Error reading source directory: ${err.message}`);
}

// Also check client/public/images/medicines for any images not in source
const clientImagesDir = path.join(__dirname, 'client', 'public', 'images', 'medicines');
try {
  if (fs.existsSync(clientImagesDir)) {
    const clientImages = fs.readdirSync(clientImagesDir)
      .filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.png'));
    
    // Add any images not already in our list
    clientImages.forEach(img => {
      if (!imageFiles.includes(img)) {
        imageFiles.push(img);
        console.log(`Added ${img} from client images directory`);
      }
    });
  }
} catch (err) {
  console.error(`Error checking client images directory: ${err.message}`);
}

if (imageFiles.length === 0) {
  console.log('\n⚠️ No image files found in any directories! Please add medicine images to the medicinesImages folder.');
} else {
  console.log(`\nFound a total of ${imageFiles.length} unique images to process`);
  
  // Copy each image to all target directories
  imageFiles.forEach(file => {
    console.log(`\nProcessing ${file}:`);
    
    // Determine source path - could be in either directory
    let sourcePath = path.join(sourceDir, file);
    if (!fs.existsSync(sourcePath)) {
      sourcePath = path.join(clientImagesDir, file);
      if (!fs.existsSync(sourcePath)) {
        console.log(`  ❌ Source file not found: ${file}`);
        return;
      }
    }
    
    // Copy to each target directory
    targetDirs.forEach(targetDir => {
      const targetPath = path.join(targetDir, file);
      try {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`  ✅ Copied to ${targetDir}`);
      } catch (err) {
        console.error(`  ❌ Error copying to ${targetDir}: ${err.message}`);
      }
    });
  });
}

// Create simple placeholder images for common medicines if not found
const ensureMedicineImages = () => {
  console.log('\nChecking for essential medicine images...');
  
  const essentialMedicines = [
    'Paracetamol.jpg',
    'Amoxycillin.jpg',
    'Metaformin.jpg', 
    'Lisinoprill.jpg',
    'Salbutamol.jpg',
    'Omeprazole.jpg',
    'Ibuprofin.jpg',
    'Atorvastatin.jpg',
    'no-image.jpg'
  ];
  
  // Create a colored square as placeholder (better than the minimal JPEG)
  const createPlaceholder = (targetPath, color = '#3498db') => {
    const width = 200;
    const height = 200;
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${path.basename(targetPath)}
      </text>
    </svg>`;
    
    // Save as base64-encoded JPEG
    const base64Data = Buffer.from(svg).toString('base64');
    fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));
  };
  
  // Check each essential medicine image
  essentialMedicines.forEach(filename => {
    let found = false;
    
    // Check if it exists in any target directory
    targetDirs.forEach(dir => {
      const filepath = path.join(dir, filename);
      if (fs.existsSync(filepath)) {
        found = true;
      }
    });
    
    // If not found, create placeholders in all directories
    if (!found) {
      console.log(`Creating placeholder for missing essential image: ${filename}`);
      
      // Random pastel color based on filename for visual distinction
      const hash = filename.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hue = hash % 360;
      const color = `hsl(${hue}, 70%, 80%)`;
      
      targetDirs.forEach(dir => {
        const targetPath = path.join(dir, filename);
        try {
          createPlaceholder(targetPath, color);
          console.log(`  ✅ Created placeholder in ${dir}`);
        } catch (err) {
          console.error(`  ❌ Error creating placeholder in ${dir}: ${err.message}`);
        }
      });
    }
  });
};

// Call the function to ensure essential medicine images
ensureMedicineImages();

console.log('\n✅ Image processing complete');
console.log('===============================');
console.log('Your medicine images have been copied to all required directories.');
console.log('Please restart your server and client applications.'); 