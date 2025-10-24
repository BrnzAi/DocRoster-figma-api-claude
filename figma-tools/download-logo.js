const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const FILE_KEY = process.env.FIGMA_FILE_ID;
const TOKEN = process.env.FIGMA_TOKEN;

// Step 1: Get image URL from Figma API
const options = {
  hostname: 'api.figma.com',
  path: `/v1/images/${FILE_KEY}?ids=2068:50&format=png&scale=2`,
  headers: {
    'X-Figma-Token': TOKEN
  }
};

console.log('Requesting logo image URL...');

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const result = JSON.parse(data);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.images && result.images['2068:50']) {
      const imageUrl = result.images['2068:50'];
      console.log('Downloading logo from:', imageUrl);
      
      // Step 2: Download the image
      https.get(imageUrl, (imgRes) => {
        const outputDir = 'docroster-app/public/assets';
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const filePath = outputDir + '/docroster-logo.png';
        const fileStream = fs.createWriteStream(filePath);
        
        imgRes.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log('✅ Logo downloaded successfully to:', filePath);
        });
      }).on('error', (err) => {
        console.error('Download error:', err.message);
      });
    } else {
      console.error('No image URL in response');
    }
  });
}).on('error', (err) => {
  console.error('API error:', err.message);
});
