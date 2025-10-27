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

// Load the profile-pages-all.json to find all images
const profileData = JSON.parse(fs.readFileSync('./profile-pages-all.json', 'utf8'));

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

function findImageRefs(node, refs = new Set()) {
  if (node.fills) {
    node.fills.forEach(fill => {
      if (fill.type === 'IMAGE' && fill.imageRef) {
        refs.add(fill.imageRef);
      }
    });
  }
  
  if (node.children) {
    node.children.forEach(child => findImageRefs(child, refs));
  }
  
  return refs;
}

async function downloadProfileImages() {
  console.log('Finding all image references in profile design...');
  
  // Find all image references
  const imageRefs = findImageRefs(profileData);
  console.log(`Found ${imageRefs.size} unique images`);
  
  // Get download URLs from Figma
  const imageRefsArray = Array.from(imageRefs);
  const imageIds = imageRefsArray.join(',');
  
  console.log('Requesting image URLs from Figma...');
  const imagesUrl = `https://api.figma.com/v1/files/${FILE_KEY}/images`;
  const response = await makeRequest(imagesUrl);
  
  if (!response.meta || !response.meta.images) {
    console.error('No images found in response');
    return;
  }
  
  // Create output directory
  const outputDir = path.join(__dirname, '..', 'docroster-app', 'public', 'assets', 'profile');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Download each image
  console.log('Downloading images...');
  let imageIndex = 0;
  
  for (const [imageRef, imageUrl] of Object.entries(response.meta.images)) {
    if (!imageUrl) continue;
    
    imageIndex++;
    const filename = `profile-img-${imageIndex}.png`;
    const filepath = path.join(outputDir, filename);
    
    console.log(`Downloading ${filename}...`);
    await downloadImage(imageUrl, filepath);
    console.log(`✓ Saved ${filename}`);
  }
  
  console.log(`\n✓ Downloaded ${imageIndex} images to ${outputDir}`);
  
  // Also download specific specialist images (Ellipse 5 - avatars)
  console.log('\nLooking for specialist avatars (Ellipse 5)...');
  
  function findSpecialistAvatars(node, avatars = []) {
    if (node.name === 'Ellipse 5' && node.type === 'ELLIPSE') {
      if (node.fills && node.fills[0] && node.fills[0].type === 'IMAGE') {
        avatars.push({
          name: node.name,
          imageRef: node.fills[0].imageRef,
          parent: node.parent
        });
      }
    }
    
    if (node.children) {
      node.children.forEach(child => {
        child.parent = node.name;
        findSpecialistAvatars(child, avatars);
      });
    }
    
    return avatars;
  }
  
  const avatars = findSpecialistAvatars(profileData);
  console.log(`Found ${avatars.length} specialist avatars`);
  
  // Create mapping file
  const mapping = {
    profileImages: imageRefsArray.map((ref, idx) => ({
      imageRef: ref,
      filename: `profile-img-${idx + 1}.png`
    })),
    specialists: avatars.map((avatar, idx) => ({
      imageRef: avatar.imageRef,
      filename: `specialist-${idx + 1}.png`,
      parent: avatar.parent
    }))
  };
  
  fs.writeFileSync('./profile-images-mapping.json', JSON.stringify(mapping, null, 2));
  console.log('\n✓ Created profile-images-mapping.json');
}

downloadProfileImages().catch(console.error);
