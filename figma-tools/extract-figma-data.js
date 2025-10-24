const fs = require('fs');

// Read the already fetched figma-design.json
const figmaData = JSON.parse(fs.readFileSync('./figma-tools/figma-design.json', 'utf8'));

console.log('=== EXTRACTING FIGMA DESIGN DATA ===\n');

// Helper to find all text nodes
function findTextNodes(node, texts = [], path = '') {
  if (node.type === 'TEXT' && node.characters) {
    texts.push({
      path: path + ' > ' + node.name,
      text: node.characters,
      style: node.style,
      position: node.absoluteBoundingBox
    });
  }
  
  if (node.children) {
    node.children.forEach(child => {
      findTextNodes(child, texts, path + ' > ' + node.name);
    });
  }
  
  return texts;
}

// Helper to find image fills
function findImages(node, images = [], path = '') {
  if (node.fills && Array.isArray(node.fills)) {
    node.fills.forEach(fill => {
      if (fill.type === 'IMAGE' && fill.imageRef) {
        images.push({
          name: node.name,
          path: path + ' > ' + node.name,
          imageRef: fill.imageRef,
          bounds: node.absoluteBoundingBox
        });
      }
    });
  }
  
  if (node.children) {
    node.children.forEach(child => {
      findImages(child, images, path + ' > ' + node.name);
    });
  }
  
  return images;
}

// Helper to find specific frames
function findFrameByName(node, searchName) {
  if (node.name && node.name.toLowerCase().includes(searchName.toLowerCase())) {
    return node;
  }
  
  if (node.children) {
    for (const child of node.children) {
      const found = findFrameByName(child, searchName);
      if (found) return found;
    }
  }
  
  return null;
}

// Extract all images
const allImages = findImages(figmaData.document);
console.log(`Found ${allImages.length} images\n`);

// Find login page
const loginFrame = findFrameByName(figmaData.document, 'login');
if (loginFrame) {
  console.log('=== LOGIN PAGE FOUND ===');
  console.log('Frame:', loginFrame.name);
  
  const loginTexts = findTextNodes(loginFrame);
  console.log('\nText elements in login page:');
  loginTexts.forEach(t => {
    if (t.text.trim()) {
      console.log(`  - "${t.text.substring(0, 60)}${t.text.length > 60 ? '...' : ''}"`);
    }
  });
  
  const loginImages = findImages(loginFrame);
  console.log(`\nImages in login page: ${loginImages.length}`);
  loginImages.forEach(img => {
    console.log(`  - ${img.name}: ${img.imageRef}`);
  });
}

// Find specialist detail pages
const specialistTexts = findTextNodes(figmaData.document)
  .filter(t => t.text.includes('Dr. Emily Carter'));

console.log('\n=== SPECIALIST CONTENT FOUND ===');
const fullDescriptions = specialistTexts.filter(t => t.text.length > 100);
console.log(`Found ${fullDescriptions.length} full descriptions`);
if (fullDescriptions.length > 0) {
  console.log('\nFull specialist description:');
  console.log('---');
  console.log(fullDescriptions[0].text);
  console.log('---');
}

// Extract button texts
const buttonTexts = findTextNodes(figmaData.document)
  .filter(t => {
    const text = t.text.toLowerCase();
    return text.includes('sign in') || 
           text.includes('google') || 
           text.includes('apple') || 
           text.includes('register') ||
           text.includes('call') ||
           text.includes('navigate');
  });

console.log('\n=== BUTTONS FOUND ===');
buttonTexts.forEach(t => {
  console.log(`  - "${t.text}"`);
});

// Save extracted data
const extractedData = {
  images: allImages,
  loginTexts: loginFrame ? findTextNodes(loginFrame) : [],
  specialistDescriptions: fullDescriptions,
  buttons: buttonTexts
};

fs.writeFileSync('./figma-tools/extracted-data.json', JSON.stringify(extractedData, null, 2));
console.log('\n✅ Extracted data saved to figma-tools/extracted-data.json');

console.log('\n=== EXTRACTION COMPLETE ===');
