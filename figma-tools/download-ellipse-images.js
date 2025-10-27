const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_ID || '5DDZSna15Jo31PXqMdHGde';

if (!FIGMA_TOKEN) {
  console.error('❌ Error: FIGMA_TOKEN not found in .env file');
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

function findEllipse5Images(data) {
  const ellipses = [];
  
  function traverse(node, context = '') {
    if (node.name === 'Ellipse 5' && node.type === 'ELLIPSE') {
      if (node.fills && node.fills[0] && node.fills[0].type === 'IMAGE') {
        ellipses.push({
          id: node.id,
          name: node.name,
          imageRef: node.fills[0].imageRef,
          context: context,
          rect: node.rect
        });
      }
    }
    
    if (node.children) {
      node.children.forEach(child => {
        traverse(child, context || node.name);
      });
    }
  }
  
  if (Array.isArray(data)) {
    data.forEach(item => traverse(item));
  } else {
    traverse(data);
  }
  
  return ellipses;
}

async function downloadAllEllipseImages() {
  console.log('📋 Reading JSON files...\n');
  
  // Read all JSON files
  const searchData = JSON.parse(fs.readFileSync('./search-layout.json', 'utf8'));
  const profileData = JSON.parse(fs.readFileSync('./profile-pages-all.json', 'utf8'));
  const specialistData = JSON.parse(fs.readFileSync('./specialist-pages-all.json', 'utf8'));
  
  console.log('🔍 Finding all Ellipse 5 images...\n');
  
  const searchEllipses = findEllipse5Images(searchData);
  const profileEllipses = findEllipse5Images(profileData);
  const specialistEllipses = findEllipse5Images(specialistData);
  
  console.log(`Found ${searchEllipses.length} in search-layout.json`);
  console.log(`Found ${profileEllipses.length} in profile-pages-all.json`);
  console.log(`Found ${specialistEllipses.length} in specialist-pages-all.json`);
  
  // Combine and deduplicate by imageRef
  const allEllipses = [...searchEllipses, ...profileEllipses, ...specialistEllipses];
  const uniqueImageRefs = new Map();
  
  allEllipses.forEach(ellipse => {
    if (!uniqueImageRefs.has(ellipse.imageRef)) {
      uniqueImageRefs.set(ellipse.imageRef, ellipse);
    }
  });
  
  console.log(`\n📊 Total unique images: ${uniqueImageRefs.size}\n`);
  
  // Get image URLs from Figma API
  const imageRefs = Array.from(uniqueImageRefs.keys());
  const imageIds = imageRefs.join(',');
  
  console.log('🌐 Requesting image URLs from Figma API...\n');
  
  const imagesUrl = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${imageIds}&format=png`;
  const response = await makeRequest(imagesUrl);
  
  if (!response.images) {
    console.error('❌ No images found in response');
    console.log(response);
    return;
  }
  
  // Create output directory
  const outputDir = path.join(__dirname, '..', 'docroster-app', 'public', 'assets', 'specialists');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log(`📁 Output directory: ${outputDir}\n`);
  console.log('⬇️  Downloading images...\n');
  
  // Download each image
  let imageIndex = 0;
  const mapping = [];
  
  for (const [imageRef, imageUrl] of Object.entries(response.images)) {
    if (!imageUrl) {
      console.log(`⚠️  No URL for imageRef: ${imageRef}`);
      continue;
    }
    
    imageIndex++;
    const ellipse = uniqueImageRefs.get(imageRef);
    const filename = `specialist-${imageIndex}.png`;
    const filepath = path.join(outputDir, filename);
    
    console.log(`  ${imageIndex}. ${filename} (${ellipse.context || 'unknown context'})`);
    
    await downloadImage(imageUrl, filepath);
    
    mapping.push({
      filename: filename,
      imageRef: imageRef,
      id: ellipse.id,
      context: ellipse.context,
      path: `assets/specialists/${filename}`
    });
  }
  
  console.log(`\n✅ Downloaded ${imageIndex} images successfully!\n`);
  
  // Save mapping file
  fs.writeFileSync('./ellipse-images-mapping.json', JSON.stringify(mapping, null, 2));
  console.log('📝 Created ellipse-images-mapping.json\n');
  
  // Print usage guide
  console.log('📖 Usage in code:');
  console.log('   Use: assets/specialists/specialist-1.png');
  console.log('   Use: assets/specialists/specialist-2.png');
  console.log('   etc.\n');
}

downloadAllEllipseImages().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
