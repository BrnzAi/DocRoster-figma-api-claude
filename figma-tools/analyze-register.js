const fs = require('fs');
const data = JSON.parse(fs.readFileSync('figma-tools/figma-design.json', 'utf8'));

function findRegisterPage(node, path = '') {
  // Look for auth frame that contains Terms and Conditions (register page indicator)
  if (node.name === 'auth' && node.type === 'FRAME') {
    const content = JSON.stringify(node);
    if (content.includes('Terms and Conditions') || content.includes('Sign up to DocRoster')) {
      console.log('=== REGISTER PAGE FOUND ===');
      console.log('Path:', path);
      console.log('Size:', node.absoluteBoundingBox.width, 'x', node.absoluteBoundingBox.height);
      
      function printStructure(n, indent = '', showAll = false) {
        const info = `${indent}${n.name} (${n.type})`;
        console.log(info);
        
        if (n.absoluteBoundingBox) {
          console.log(`${indent}  Size: ${n.absoluteBoundingBox.width}x${n.absoluteBoundingBox.height}`);
        }
        if (n.characters) {
          console.log(`${indent}  Text: "${n.characters}"`);
        }
        if (n.layoutMode) {
          console.log(`${indent}  Layout: ${n.layoutMode}, Gap: ${n.itemSpacing}`);
        }
        if (n.children && (showAll || indent.length < 10)) {
          n.children.forEach(child => printStructure(child, indent + '  ', showAll || n.name.includes('Frame')));
        }
      }
      
      printStructure(node);
    }
  }
  
  if (node.children) {
    node.children.forEach(child => findRegisterPage(child, path + ' > ' + child.name));
  }
}

findRegisterPage(data.document);
