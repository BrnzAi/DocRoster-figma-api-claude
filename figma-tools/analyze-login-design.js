const fs = require('fs');

const figmaData = JSON.parse(fs.readFileSync('./figma-tools/figma-design.json', 'utf8'));

function findAuthFrame(node) {
  if (node.name && (node.name.toLowerCase() === 'auth' || node.name.toLowerCase() === 'login')) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findAuthFrame(child);
      if (found) return found;
    }
  }
  return null;
}

function analyzeNode(node, depth = 0, parent = '') {
  const indent = '  '.repeat(depth);
  const info = {
    name: node.name,
    type: node.type,
    width: node.absoluteBoundingBox?.width,
    height: node.absoluteBoundingBox?.height,
  };
  
  if (node.type === 'TEXT' && node.characters) {
    console.log(`${indent}📝 TEXT: "${node.characters}"`);
    console.log(`${indent}   Font: ${node.style?.fontFamily} ${node.style?.fontWeight} ${node.style?.fontSize}px`);
    console.log(`${indent}   Color: rgb(${Math.round(node.fills?.[0]?.color?.r * 255)}, ${Math.round(node.fills?.[0]?.color?.g * 255)}, ${Math.round(node.fills?.[0]?.color?.b * 255)})`);
  }
  
  if (node.type === 'FRAME' && node.name) {
    console.log(`${indent}📦 FRAME: ${node.name}`);
    console.log(`${indent}   Size: ${info.width}x${info.height}px`);
    if (node.layoutMode) {
      console.log(`${indent}   Layout: ${node.layoutMode}, Gap: ${node.itemSpacing}px`);
    }
    if (node.paddingLeft) {
      console.log(`${indent}   Padding: ${node.paddingTop}/${node.paddingRight}/${node.paddingBottom}/${node.paddingLeft}px`);
    }
  }
  
  if (node.children && depth < 4) {
    node.children.forEach(child => analyzeNode(child, depth + 1, node.name));
  }
}

const authFrame = findAuthFrame(figmaData.document);
if (authFrame) {
  console.log('=== AUTH/LOGIN FRAME FOUND ===\n');
  console.log(`Main Frame: ${authFrame.name}`);
  console.log(`Size: ${authFrame.absoluteBoundingBox.width}x${authFrame.absoluteBoundingBox.height}px\n`);
  console.log('=== STRUCTURE ===\n');
  analyzeNode(authFrame);
} else {
  console.log('❌ Auth frame not found');
}
