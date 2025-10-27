const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_ID || '5DDZSna15Jo31PXqMdHGde';

if (!FIGMA_TOKEN) {
  console.error('❌ Error: FIGMA_TOKEN not found in .env file');
  console.log('\n💡 Please create a .env file with:');
  console.log('   FIGMA_TOKEN=your_token_here\n');
  process.exit(1);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Status: ${res.statusCode}, Data: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function downloadImages() {
  console.log('📋 Reading mapping file...\n');
  
  const mapping = JSON.parse(fs.readFileSync('./ellipse-images-mapping.json', 'utf8'));
  
  console.log(`Found ${mapping.length} images to download\n`);
  console.log(`Using Figma File: ${FILE_KEY}\n`);
  
  // Get node IDs (format: 1814:1178)
  const nodeIds = mapping.map(m => m.id).join(',');
  
  console.log('🌐 Requesting image URLs from Figma API...\n');
  
  const imagesUrl = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${nodeIds}&format=png`;
  const response = await makeRequest(imagesUrl);
  
  if (!response.images) {
    console.error('❌ No images found in response');
    console.log(JSON.stringify(response, null, 2));
    return;
  }
  
  console.log(`✅ Got ${Object.keys(response.images).length} image URLs\n`);
  
  // Create output directory
  const outputDir = path.join(__dirname, '..', 'docroster-app', 'public', 'assets', 'specialists');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log(`📁 Output directory: ${outputDir}\n`);
  console.log('⬇️  Downloading images...\n');
  
  // Download each image
  let downloaded = 0;
  
  for (const item of mapping) {
    const imageUrl = response.images[item.id];
    
    if (!imageUrl) {
      console.log(`⚠️  No URL for ${item.filename} (node: ${item.id})`);
      continue;
    }
    
    const filepath = path.join(outputDir, item.filename);
    
    console.log(`  ⬇️  ${item.filename}...`);
    
    await downloadImage(imageUrl, filepath);
    downloaded++;
    
    console.log(`  ✅ Saved ${item.filename}`);
  }
  
  console.log(`\n🎉 Downloaded ${downloaded}/${mapping.length} images successfully!\n`);
  console.log('📖 Images saved to: docroster-app/public/assets/specialists/\n');
}

downloadImages().catch(error => {
  console.error('\n❌ Error:', error.message);
  
  if (error.message.includes('403')) {
    console.log('\n💡 The Figma token may have expired.');
    console.log('   Please get a new token from:');
    console.log('   https://www.figma.com/developers/api#access-tokens\n');
  }
  
  process.exit(1);
});
