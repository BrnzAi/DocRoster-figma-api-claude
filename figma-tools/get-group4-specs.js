const fs = require('fs');
const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_ID = process.env.FIGMA_FILE_ID;
const NODE_ID = '2113-41'; // Group 4 node

// Fetch specific node from Figma
const apiUrl = `https://api.figma.com/v1/files/${FILE_ID}/nodes?ids=${NODE_ID}`;

console.log('Fetching Group 4 specs from Figma...\n');

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

    // Extract detailed node info
    function extractNodeDetails(node, depth = 0) {
      const indent = '  '.repeat(depth);
      const details = {
        name: node.name,
        type: node.type,
        x: node.absoluteBoundingBox?.x,
        y: node.absoluteBoundingBox?.y,
        width: node.absoluteBoundingBox?.width,
        height: node.absoluteBoundingBox?.height,
        fills: node.fills,
        strokes: node.strokes,
        effects: node.effects,
        cornerRadius: node.cornerRadius,
        characters: node.characters,
        style: node.style,
        layoutMode: node.layoutMode,
        primaryAxisSizingMode: node.primaryAxisSizingMode,
        counterAxisSizingMode: node.counterAxisSizingMode,
        paddingLeft: node.paddingLeft,
        paddingRight: node.paddingRight,
        paddingTop: node.paddingTop,
        paddingBottom: node.paddingBottom,
        itemSpacing: node.itemSpacing
      };

      console.log(`${indent}${node.name} (${node.type})`);
      if (node.absoluteBoundingBox) {
        console.log(`${indent}  Size: ${node.absoluteBoundingBox.width}x${node.absoluteBoundingBox.height}`);
        console.log(`${indent}  Position: (${node.absoluteBoundingBox.x}, ${node.absoluteBoundingBox.y})`);
      }
      if (node.cornerRadius) {
        console.log(`${indent}  Corner Radius: ${node.cornerRadius}px`);
      }
      if (node.characters) {
        console.log(`${indent}  Text: "${node.characters}"`);
      }
      if (node.layoutMode) {
        console.log(`${indent}  Layout: ${node.layoutMode}, spacing: ${node.itemSpacing}px`);
      }
      
      if (node.children) {
        node.children.forEach(child => extractNodeDetails(child, depth + 1));
      }

      return details;
    }

    const nodeData = response.nodes[NODE_ID];
    if (nodeData && nodeData.document) {
      console.log('\n=== Group 4 Structure ===\n');
      const details = extractNodeDetails(nodeData.document);
      
      // Save to file
      const outputPath = path.join(__dirname, 'group4-detailed-specs.json');
      fs.writeFileSync(outputPath, JSON.stringify(nodeData.document, null, 2));
      console.log(`\n✅ Saved detailed specs to: ${outputPath}\n`);
    } else {
      console.log('❌ Node not found');
    }
  });
}).on('error', (err) => {
  console.error('❌ Error:', err.message);
});
