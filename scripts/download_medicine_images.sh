#!/bin/bash
# Script to download sample medicine images for the drug inventory system

# Create image directory if it doesn't exist
mkdir -p client/public/images/medicines

cd client/public/images/medicines

# Download images for each medicine in our sample data
echo "Downloading medicine images..."

# Paracetamol
curl -o paracetamol.jpg "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" || echo "Failed to download paracetamol.jpg"

# Amoxicillin
curl -o amoxicillin.jpg "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" || echo "Failed to download amoxicillin.jpg"

# Metformin
curl -o metformin.jpg "https://images.unsplash.com/photo-1550572017-edd951b55104?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" || echo "Failed to download metformin.jpg"

# Lisinopril
curl -o lisinopril.jpg "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" || echo "Failed to download lisinopril.jpg"

# Salbutamol Inhaler
curl -o salbutamol.jpg "https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" || echo "Failed to download salbutamol.jpg"

# Omeprazole
curl -o omeprazole.jpg "https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" || echo "Failed to download omeprazole.jpg"

# Ibuprofen
curl -o ibuprofen.jpg "https://images.unsplash.com/photo-1558956397-d89fe6bb84e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" || echo "Failed to download ibuprofen.jpg"

# Atorvastatin
curl -o atorvastatin.jpg "https://images.unsplash.com/photo-1626716493137-b67fe490a849?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" || echo "Failed to download atorvastatin.jpg"

# Default no-image placeholder
curl -o no-image.jpg "https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" || echo "Failed to download no-image.jpg"

echo "Download completed. Images saved to client/public/images/medicines/"
echo "You might need to adjust the file paths or download images manually if any downloads failed."

cd - 