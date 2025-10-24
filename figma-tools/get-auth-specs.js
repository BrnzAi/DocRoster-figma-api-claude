const fs = require('fs');
const figma = JSON.parse(fs.readFileSync('./figma-tools/figma-design.json', 'utf8'));

function findByName(node, searchName, results = []) {
  if (node.name && node.name.includes(searchName)) {
    results.push(node);
  }
  if (node.children) {
    node.children.forEach(child => findByName(child, searchName, results));
  }
  return results;
}

// Find auth frame 1000002909
const authFrames = findByName(figma.document, 'Frame 1000002909');
console.log(`Found ${authFrames.length} auth frames\n`);

if (authFrames.length > 0) {
  const auth = authFrames[0];
  console.log('=== AUTH BOX SPECIFICATIONS ===\n');
  console.log(`Width: ${auth.absoluteBoundingBox?.width}px`);
  console.log(`Height: ${auth.absoluteBoundingBox?.height}px`);
  console.log(`Padding: Top:${auth.paddingTop}, Right:${auth.paddingRight}, Bottom:${auth.paddingBottom}, Left:${auth.paddingLeft}`);
  console.log(`Corner Radius: ${auth.cornerRadius}px`);
  console.log(`Item Spacing: ${auth.itemSpacing}px`);
  console.log(`\n=== CHILDREN ===\n`);
  
  auth.children?.forEach((child, i) => {
    console.log(`${i + 1}. ${child.name} (${child.type})`);
    if (child.absoluteBoundingBox) {
      console.log(`   Size: ${child.absoluteBoundingBox.width}x${child.absoluteBoundingBox.height}px`);
    }
    if (child.type === 'TEXT') {
      console.log(`   Text: "${child.characters}"`);
      console.log(`   Font: ${child.style?.fontFamily} ${child.style?.fontWeight} ${child.style?.fontSize}px`);
    }
    if (child.children) {
      child.children.forEach((subchild, j) => {
        console.log(`   ${i}.${j + 1} ${subchild.name}`);
        if (subchild.type === 'TEXT') {
          console.log(`        Text: "${subchild.characters}"`);
        }
      });
    }
    console.log('');
  });
}
