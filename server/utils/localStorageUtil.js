const fs = require('fs').promises;
const path = require('path');

const MEDICINES_FILE = path.join(__dirname, '../data/medicines.json');

// Ensure the data directory exists
const ensureDataDir = async () => {
  const dataDir = path.dirname(MEDICINES_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Read medicines data
const readMedicinesData = async () => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(MEDICINES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return default structure
    return { medicines: [] };
  }
};

// Write medicines data
const writeMedicinesData = async (data) => {
  await ensureDataDir();
  await fs.writeFile(MEDICINES_FILE, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = {
  readMedicinesData,
  writeMedicinesData
}; 