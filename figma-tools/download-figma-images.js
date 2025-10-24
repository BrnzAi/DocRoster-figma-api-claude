const fs = require('fs');
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_ID = process.env.FIGMA_FILE_ID;

// Read extracted data
const extractedData = JSON.parse(fs.readFileSync('./figma-tools/extracted-data.json', 'utf8'));

// Get unique image refs from specialist avatars (Ellipse 3 images)
const specialistImages = extractedData.images
  .filter(img => img.name && img.name.includes('Ellipse'))
  .slice(0, 20); // Get first 20 specialist images

console.log(`Found ${specialistImages.length} specialist images to download\n`);

// Create output directory
const outputDir = './docroster-app/public/assets/specialists';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✅ Created directory: ${outputDir}\n`);
}

// Get image URLs from Figma
const imageIds = specialistImages.map(img => img.imageRef).join(',');
const apiUrl = `https://api.figma.com/v1/images/${FILE_ID}?ids=${imageIds}&format=png&scale=2`;

console.log('Fetching image URLs from Figma API...\n');

https.get(apiUrl, {
  headers: { 'X-Figma-Token': FIGMA_TOKEN }
}, (res) => {
  let data = '';
  
  res.on('data', chunk => data += chunk);
  
  res.on('end', () => {
    const response = JSON.parse(data);
    
    if (response.err) {
      console.error('❌ Figma API Error:', response.err);
      return;
    }
    
    if (!response.images) {
      console.error('❌ No images returned');
      return;
    }
    
    console.log(`✅ Got ${Object.keys(response.images).length} image URLs\n`);
    
    // Download each image
    let downloaded = 0;
    Object.entries(response.images).forEach(([imageRef, imageUrl], index) => {
      if (!imageUrl) {
        console.log(`⚠️  No URL for image ${index + 1}`);
        return;
      }
      
      const filename = `specialist-${index + 1}.png`;
      const filePath = path.join(outputDir, filename);
      
      https.get(imageUrl, (imgRes) => {
        const fileStream = fs.createWriteStream(filePath);
        imgRes.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          downloaded++;
          console.log(`✅ Downloaded ${downloaded}/${Object.keys(response.images).length}: ${filename}`);
          
          if (downloaded === Object.keys(response.images).length) {
            console.log('\n🎉 All images downloaded successfully!');
          }
        });
      }).on('error', (err) => {
        console.error(`❌ Error downloading ${filename}:`, err.message);
      });
    });
  });
}).on('error', (err) => {
  console.error('❌ API request failed:', err.message);
});
