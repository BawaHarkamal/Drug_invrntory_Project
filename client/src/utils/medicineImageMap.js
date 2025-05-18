/**
 * Maps medicine names to their image filenames
 * This allows us to handle inconsistencies in image naming
 */
const medicineImageMap = {
  // Exact matches to filenames in the images directory
  "Paracetamol": "Paracetamol.jpg",
  "Amoxicillin": "Amoxycillin.jpg",
  "Metformin": "Metaformin.jpg",
  "Lisinopril": "Lisinoprill.jpg",
  "Salbutamol": "Salbutamol.jpg",
  "Omeprazole": "Omeprazole.jpg",
  "Ibuprofen": "Ibuprofin.jpg",
  "Atorvastatin": "Atorvastatin.jpg",
  
  // Add common variations just in case
  "Amoxycillin": "Amoxycillin.jpg",
  "Metaformin": "Metaformin.jpg",
  "Lisinoprill": "Lisinoprill.jpg",
  "Ibuprofin": "Ibuprofin.jpg"
};

/**
 * Get the correct image filename for a medicine
 * @param {string} medicineName - The name of the medicine
 * @param {string} defaultImage - Image filename to use if not found (default: no-image.jpg)
 * @returns {string} The image filename to use
 */
export const getMedicineImage = (medicineName, defaultImage = "no-image.jpg") => {
  if (!medicineName) {
    console.log('Medicine name is undefined or null, using default image');
    return defaultImage;
  }
  
  console.log(`Looking up image for medicine: ${medicineName}`);
  
  // If we have a direct mapping, use it
  if (medicineImageMap[medicineName]) {
    console.log(`Found direct mapping: ${medicineImageMap[medicineName]}`);
    return medicineImageMap[medicineName];
  }
  
  // Try case-insensitive match
  const lcMedicineName = medicineName.toLowerCase();
  const caseInsensitiveMatch = Object.keys(medicineImageMap).find(
    key => key.toLowerCase() === lcMedicineName
  );
  
  if (caseInsensitiveMatch) {
    console.log(`Found case-insensitive match: ${medicineImageMap[caseInsensitiveMatch]}`);
    return medicineImageMap[caseInsensitiveMatch];
  }
  
  // Try to extract the base name and check if we have a mapping
  const baseName = medicineName.split(' ')[0];
  console.log(`Checking partial match with base name: ${baseName}`);
  
  // Check for partial matches
  const matchingKey = Object.keys(medicineImageMap).find(
    key => key.toLowerCase().includes(baseName.toLowerCase()) || 
           baseName.toLowerCase().includes(key.toLowerCase())
  );
  
  if (matchingKey) {
    console.log(`Found partial match: ${medicineImageMap[matchingKey]}`);
    return medicineImageMap[matchingKey];
  }
  
  // If no match is found, try using the medicine name directly with .jpg extension
  console.log(`No mapping found, trying direct filename: ${medicineName}.jpg`);
  return `${medicineName}.jpg`;
};

export default medicineImageMap; 