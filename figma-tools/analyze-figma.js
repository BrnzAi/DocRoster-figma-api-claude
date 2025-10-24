const fs = require('fs');

// Read the Figma JSON
const data = fs.readFileSync('./figma-tools/figma-design.json', 'utf8');
const json = JSON.parse(data);

console.log("=== FIGMA FILE STRUCTURE ===\n");
console.log("Document name:", json.name);
console.log("Last modified:", json.lastModified);

// Find all top-level frames
function findFrames(node, depth = 0) {
  if (node.type === 'CANVAS' || node.type === 'FRAME') {
    console.log("  ".repeat(depth) + "- " + node.name + " (" + node.type + ")");
    
    if (node.name && (node.name.toLowerCase().includes('login') || 
        node.name.toLowerCase().includes('auth') ||
        node.name.toLowerCase().includes('detail') ||
        node.name.toLowerCase().includes('search'))) {
      console.log("  ".repeat(depth) + "  ★ IMPORTANT PAGE");
    }
  }
  
  if (node.children && depth < 3) {
    node.children.forEach(child => findFrames(child, depth + 1));
  }
}

if (json.document && json.document.children) {
  json.document.children.forEach(canvas => findFrames(canvas, 0));
}

// Find images
console.log("\n=== IMAGE REFERENCES ===");
if (json.components) {
  Object.keys(json.components).slice(0, 10).forEach(key => {
    const comp = json.components[key];
    if (comp.name) {
      console.log("Component:", comp.name);
    }
  });
}

