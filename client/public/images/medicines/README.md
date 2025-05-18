# Medicine Images

This directory should contain images for the medicines in your inventory system. Below are the image filenames that should be placed in this directory to match the sample data:

## Required Image Files

1. **paracetamol.jpg** - Paracetamol 500mg
2. **amoxicillin.jpg** - Amoxicillin 250mg
3. **metformin.jpg** - Metformin 500mg
4. **lisinopril.jpg** - Lisinopril 10mg
5. **salbutamol.jpg** - Salbutamol Inhaler
6. **omeprazole.jpg** - Omeprazole 20mg
7. **ibuprofen.jpg** - Ibuprofen 400mg
8. **atorvastatin.jpg** - Atorvastatin 10mg
9. **no-image.jpg** - Default placeholder image

## How to Add Images

You can download free stock images from websites like Unsplash, Pexels, or Pixabay that represent medications or pills. Make sure to rename them according to the list above.

### Suggested Image URLs

Here are suggested image URLs from Unsplash that you can download:

1. Paracetamol: https://images.unsplash.com/photo-1584308666744-24d5c474f2ae
2. Amoxicillin: https://images.unsplash.com/photo-1471864190281-a93a3070b6de
3. Metformin: https://images.unsplash.com/photo-1550572017-edd951b55104
4. Lisinopril: https://images.unsplash.com/photo-1587854692152-cbe660dbde88
5. Salbutamol: https://images.unsplash.com/photo-1603398938378-e54eab446dde
6. Omeprazole: https://images.unsplash.com/photo-1585435557343-3b092031a831
7. Ibuprofen: https://images.unsplash.com/photo-1558956397-d89fe6bb84e7
8. Atorvastatin: https://images.unsplash.com/photo-1626716493137-b67fe490a849
9. No-image placeholder: https://images.unsplash.com/photo-1628771065518-0d82f1938462

### Using PowerShell to Download Images (Windows)

```powershell
# Create the directory if it doesn't exist
mkdir -Force -Path client/public/images/medicines

# Download the images
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae" -OutFile "client/public/images/medicines/paracetamol.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1471864190281-a93a3070b6de" -OutFile "client/public/images/medicines/amoxicillin.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1550572017-edd951b55104" -OutFile "client/public/images/medicines/metformin.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1587854692152-cbe660dbde88" -OutFile "client/public/images/medicines/lisinopril.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1603398938378-e54eab446dde" -OutFile "client/public/images/medicines/salbutamol.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1585435557343-3b092031a831" -OutFile "client/public/images/medicines/omeprazole.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1558956397-d89fe6bb84e7" -OutFile "client/public/images/medicines/ibuprofen.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1626716493137-b67fe490a849" -OutFile "client/public/images/medicines/atorvastatin.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1628771065518-0d82f1938462" -OutFile "client/public/images/medicines/no-image.jpg"
```

### Using cURL to Download Images (Linux/Mac)

```bash
# Create the directory if it doesn't exist
mkdir -p client/public/images/medicines

# Download the images
curl -o client/public/images/medicines/paracetamol.jpg "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae"
curl -o client/public/images/medicines/amoxicillin.jpg "https://images.unsplash.com/photo-1471864190281-a93a3070b6de"
curl -o client/public/images/medicines/metformin.jpg "https://images.unsplash.com/photo-1550572017-edd951b55104"
curl -o client/public/images/medicines/lisinopril.jpg "https://images.unsplash.com/photo-1587854692152-cbe660dbde88"
curl -o client/public/images/medicines/salbutamol.jpg "https://images.unsplash.com/photo-1603398938378-e54eab446dde"
curl -o client/public/images/medicines/omeprazole.jpg "https://images.unsplash.com/photo-1585435557343-3b092031a831"
curl -o client/public/images/medicines/ibuprofen.jpg "https://images.unsplash.com/photo-1558956397-d89fe6bb84e7"
curl -o client/public/images/medicines/atorvastatin.jpg "https://images.unsplash.com/photo-1626716493137-b67fe490a849"
curl -o client/public/images/medicines/no-image.jpg "https://images.unsplash.com/photo-1628771065518-0d82f1938462"
```

## Image Size and Format

For best performance:
- Keep all images in JPG or PNG format
- Resize images to a reasonable size (e.g., 500px width)
- Optimize images for web to reduce file size 