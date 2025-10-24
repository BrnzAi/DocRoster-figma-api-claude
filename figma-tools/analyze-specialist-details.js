const fs = require('fs');
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_ID = process.env.FIGMA_FILE_ID;

// Fetch the Figma file
const apiUrl = `https://api.figma.com/v1/files/${FILE_ID}`;

https.get(apiUrl, {
  headers: { 'X-Figma-Token': FIGMA_TOKEN }
}, (res) => {
  let data = '';
  
  res.on('data', chunk => data += chunk);
  
  res.on('end', () => {
    const figmaData = JSON.parse(data);
    
    // Find specialist details / profile page
    // Look for frames named "Specialist", "Profile", "Details", "Doctor", etc.
    function findSpecialistPage(node, path = '') {
      const results = [];
      const currentPath = path ? `${path} > ${node.name}` : node.name;
      
      // Check if this is a specialist/profile/details page
      const keywords = ['specialist', 'profile', 'doctor', 'dr.', 'emily', 'carter', 'detail'];
      const nodeName = node.name.toLowerCase();
      const isMatch = keywords.some(keyword => nodeName.includes(keyword));
      
      if (isMatch && node.type === 'FRAME') {
        results.push({
          name: node.name,
          path: currentPath,
          id: node.id,
          type: node.type,
          width: node.absoluteBoundingBox?.width,
          height: node.absoluteBoundingBox?.height,
          node: node
        });
      }
      
      // Recursively search children
      if (node.children) {
        node.children.forEach(child => {
          results.push(...findSpecialistPage(child, currentPath));
        });
      }
      
      return results;
    }
    
    // Extract layout specs from specialist page
    function extractLayoutSpecs(node) {
      const layout = {
        name: node.name,
        id: node.id,
        width: node.absoluteBoundingBox?.width,
        height: node.absoluteBoundingBox?.height,
        children: []
      };
      
      if (node.children) {
        node.children.forEach(child => {
          const childSpec = {
            name: child.name,
            type: child.type,
            x: child.absoluteBoundingBox?.x - node.absoluteBoundingBox?.x,
            y: child.absoluteBoundingBox?.y - node.absoluteBoundingBox?.y,
            width: child.absoluteBoundingBox?.width,
            height: child.absoluteBoundingBox?.height,
            fills: child.fills,
            strokes: child.strokes,
            effects: child.effects,
            cornerRadius: child.cornerRadius,
            characters: child.characters,
            style: child.style
          };
          
          // If has children, extract them too
          if (child.children && child.children.length > 0) {
            childSpec.children = child.children.map(grandchild => ({
              name: grandchild.name,
              type: grandchild.type,
              x: grandchild.absoluteBoundingBox?.x - child.absoluteBoundingBox?.x,
              y: grandchild.absoluteBoundingBox?.y - child.absoluteBoundingBox?.y,
              width: grandchild.absoluteBoundingBox?.width,
              height: grandchild.absoluteBoundingBox?.height,
              fills: grandchild.fills,
              strokes: grandchild.strokes,
              cornerRadius: grandchild.cornerRadius,
              characters: grandchild.characters,
              style: grandchild.style
            }));
          }
          
          layout.children.push(childSpec);
        });
      }
      
      return layout;
    }
    
    // Search for specialist page
    const pages = figmaData.document.children;
    const allMatches = [];
    
    pages.forEach(page => {
      const matches = findSpecialistPage(page);
      allMatches.push(...matches);
    });
    
    console.log('\n=== Found Specialist/Profile Pages ===\n');
    allMatches.forEach((match, i) => {
      console.log(`${i + 1}. ${match.name}`);
      console.log(`   Path: ${match.path}`);
      console.log(`   Size: ${match.width}x${match.height}`);
      console.log(`   ID: ${match.id}\n`);
    });
    
    if (allMatches.length > 0) {
      // Extract detailed specs from the first match (or most relevant one)
      const mainMatch = allMatches[0];
      const layoutSpecs = extractLayoutSpecs(mainMatch.node);
      
      // Save to file
      const outputPath = path.join(__dirname, 'specialist-details-layout.json');
      fs.writeFileSync(outputPath, JSON.stringify(layoutSpecs, null, 2));
      console.log(`✅ Saved detailed layout specs to: ${outputPath}\n`);
      
      // Also save all matches for reference
      const allMatchesPath = path.join(__dirname, 'specialist-pages-all.json');
      fs.writeFileSync(allMatchesPath, JSON.stringify(allMatches, null, 2));
      console.log(`✅ Saved all matches to: ${allMatchesPath}\n`);
    } else {
      console.log('❌ No specialist/profile pages found');
    }
  });
}).on('error', (err) => {
  console.error('❌ Error:', err.message);
});
