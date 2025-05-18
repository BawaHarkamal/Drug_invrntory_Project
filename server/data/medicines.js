// Sample medicine data for seeding the database
// Note: User IDs for manufacturer and retailer must be updated with actual IDs from your database

const medicines = [
  {
    name: "Paracetamol 500mg",
    description: "Paracetamol is a pain reliever and fever reducer. It is commonly used for mild to moderate pain relief and fever reduction.",
    category: "Analgesics",
    price: 5.99,
    stockQuantity: 1000,
    expiryDate: "2025-12-31",
    image: "paracetamol.jpg",
    prescription: false,
    composition: [
      {
        salt: "Paracetamol",
        quantity: "500mg"
      }
    ],
    lowStockThreshold: 100,
    batchNumber: "PCM-2023-001"
  },
  {
    name: "Amoxicillin 250mg",
    description: "Amoxicillin is a penicillin antibiotic used to treat a wide variety of bacterial infections.",
    category: "Antibiotics",
    price: 12.50,
    stockQuantity: 500,
    expiryDate: "2025-06-30",
    image: "amoxicillin.jpg",
    prescription: true,
    composition: [
      {
        salt: "Amoxicillin trihydrate",
        quantity: "250mg"
      }
    ],
    lowStockThreshold: 50,
    batchNumber: "AMX-2023-002"
  },
  {
    name: "Metformin 500mg",
    description: "Metformin is used to treat type 2 diabetes by decreasing glucose production by the liver and increasing insulin sensitivity.",
    category: "Antidiabetic",
    price: 8.75,
    stockQuantity: 750,
    expiryDate: "2025-08-15",
    image: "metformin.jpg",
    prescription: true,
    composition: [
      {
        salt: "Metformin hydrochloride",
        quantity: "500mg"
      }
    ],
    lowStockThreshold: 75,
    batchNumber: "MTF-2023-003"
  },
  {
    name: "Lisinopril 10mg",
    description: "Lisinopril is an ACE inhibitor used to treat high blood pressure and heart failure.",
    category: "Cardiovascular",
    price: 15.99,
    stockQuantity: 300,
    expiryDate: "2024-11-30",
    image: "lisinopril.jpg",
    prescription: true,
    composition: [
      {
        salt: "Lisinopril",
        quantity: "10mg"
      }
    ],
    lowStockThreshold: 30,
    batchNumber: "LSP-2023-004"
  },
  {
    name: "Salbutamol Inhaler",
    description: "Salbutamol is a bronchodilator that relaxes muscles in the airways and increases air flow to the lungs.",
    category: "Respiratory",
    price: 22.50,
    stockQuantity: 200,
    expiryDate: "2025-04-30",
    image: "salbutamol.jpg",
    prescription: true,
    composition: [
      {
        salt: "Salbutamol sulphate",
        quantity: "100mcg/dose"
      }
    ],
    lowStockThreshold: 20,
    batchNumber: "SLB-2023-005"
  },
  {
    name: "Omeprazole 20mg",
    description: "Omeprazole decreases the amount of acid produced in the stomach, used to treat heartburn and related conditions.",
    category: "Gastrointestinal",
    price: 9.99,
    stockQuantity: 400,
    expiryDate: "2025-10-15",
    image: "omeprazole.jpg",
    prescription: false,
    composition: [
      {
        salt: "Omeprazole",
        quantity: "20mg"
      }
    ],
    lowStockThreshold: 40,
    batchNumber: "OMP-2023-006"
  },
  {
    name: "Ibuprofen 400mg",
    description: "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain and reduce inflammation.",
    category: "Analgesics",
    price: 6.50,
    stockQuantity: 800,
    expiryDate: "2025-09-20",
    image: "ibuprofen.jpg",
    prescription: false,
    composition: [
      {
        salt: "Ibuprofen",
        quantity: "400mg"
      }
    ],
    lowStockThreshold: 80,
    batchNumber: "IBP-2023-007"
  },
  {
    name: "Atorvastatin 10mg",
    description: "Atorvastatin is used to lower cholesterol and reduce the risk of heart attack and stroke.",
    category: "Cardiovascular",
    price: 18.75,
    stockQuantity: 350,
    expiryDate: "2025-05-31",
    image: "atorvastatin.jpg",
    prescription: true,
    composition: [
      {
        salt: "Atorvastatin calcium",
        quantity: "10mg"
      }
    ],
    lowStockThreshold: 35,
    batchNumber: "ATV-2023-008"
  }
];

module.exports = medicines; 