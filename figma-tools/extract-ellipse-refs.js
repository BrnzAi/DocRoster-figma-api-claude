const fs = require('fs');

function findEllipse5Images(data) {
  const ellipses = [];
  
  function traverse(node, context = '', parentName = '') {
    if (node.name === 'Ellipse 5' && node.type === 'ELLIPSE') {
      if (node.fills && node.fills[0] && node.fills[0].type === 'IMAGE') {
        ellipses.push({
          id: node.id,
          name: node.name,
          imageRef: node.fills[0].imageRef,
          context: context,
          parentName: parentName,
          rect: node.rect
        });
      }
    }
    
    if (node.children) {
      node.children.forEach(child => {
        traverse(child, context || node.name, node.name);
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

console.log('📋 Reading JSON files...\n');

const searchData = JSON.parse(fs.readFileSync('./search-layout.json', 'utf8'));
const profileData = JSON.parse(fs.readFileSync('./profile-pages-all.json', 'utf8'));
const specialistData = JSON.parse(fs.readFileSync('./specialist-pages-all.json', 'utf8'));

console.log('🔍 Finding all Ellipse 5 images...\n');

const searchEllipses = findEllipse5Images(searchData);
const profileEllipses = findEllipse5Images(profileData);
const specialistEllipses = findEllipse5Images(specialistData);

console.log(`Found ${searchEllipses.length} in search-layout.json`);
console.log(`Found ${profileEllipses.length} in profile-pages-all.json`);
console.log(`Found ${specialistEllipses.length} in specialist-pages-all.json\n`);

// Combine and deduplicate
const allEllipses = [...searchEllipses, ...profileEllipses, ...specialistEllipses];
const uniqueImageRefs = new Map();

allEllipses.forEach((ellipse, index) => {
  if (!uniqueImageRefs.has(ellipse.imageRef)) {
    uniqueImageRefs.set(ellipse.imageRef, {
      ...ellipse,
      filename: `specialist-${uniqueImageRefs.size + 1}.png`,
      path: `assets/specialists/specialist-${uniqueImageRefs.size + 1}.png`
    });
  }
});

console.log(`📊 Total unique images: ${uniqueImageRefs.size}\n`);

const mapping = Array.from(uniqueImageRefs.values());

// Save mapping
fs.writeFileSync('./ellipse-images-mapping.json', JSON.stringify(mapping, null, 2));
console.log('✅ Created ellipse-images-mapping.json\n');

// Print details
console.log('📋 Image References:\n');
mapping.forEach((img, idx) => {
  console.log(`${idx + 1}. ${img.filename}`);
  console.log(`   imageRef: ${img.imageRef}`);
  console.log(`   node ID: ${img.id}`);
  console.log(`   context: ${img.context || 'unknown'}`);
  console.log(`   parent: ${img.parentName || 'unknown'}\n`);
});

console.log('\n📖 To download images, update the Figma token and run:');
console.log('   node download-ellipse-images.js\n');
