#!/usr/bin/env node
/**
 * AUTO-GENERATE SCSS FROM FIGMA JSON EXPORTS
 * 
 * Usage: node auto-generate-scss.js <json-file> <output-scss>
 * Example: node auto-generate-scss.js search-layout.json ../docroster-app/src/app/components/search/search.component.scss
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('❌ Usage: node auto-generate-scss.js <json-file> [output-file]');
  process.exit(1);
}

const jsonFile = args[0];
const outputFile = args[1];

console.log(`\n🎨 Auto-generating SCSS from ${jsonFile}...\n`);

// Read JSON
const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

// Color converter
function rgba(color, opacity = 1) {
  if (!color) return 'transparent';
  const r = Math.round((color.r || 0) * 255);
  const g = Math.round((color.g || 0) * 255);
  const b = Math.round((color.b || 0) * 255);
  const a = (color.a !== undefined ? color.a : 1) * opacity;
  return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Build component map
const componentMap = new Map();
data.forEach((node, index) => {
  componentMap.set(node.id, { ...node, _index: index });
});

// Generate class name from Figma name
function toClassName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Extract all CSS properties from a node
function extractAllStyles(node) {
  const css = {};
  
  // Position & Size
  if (node.rect) {
    css.width = `${node.rect.width}px`;
    css.height = `${node.rect.height}px`;
  }
  
  // Fills (background/color)
  if (node.fills && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      if (node.type === 'TEXT') {
        css.color = rgba(fill.color, fill.opacity);
      } else {
        css.background = rgba(fill.color, fill.opacity);
      }
    } else if (fill.type === 'IMAGE') {
      css.background = 'url(...)'; // Placeholder for images
      css.backgroundSize = 'cover';
    }
  }
  
  // Strokes (borders)
  if (node.strokes && node.strokes.length > 0) {
    const stroke = node.strokes[0];
    if (stroke.type === 'SOLID') {
      const weight = node.strokeWeight || 1;
      css.border = `${weight}px solid ${rgba(stroke.color, stroke.opacity)}`;
    }
  }
  
  // Corner radius
  if (node.cornerRadius !== undefined) {
    css.borderRadius = `${node.cornerRadius}px`;
  }
  
  // Effects (shadows, blur)
  if (node.effects && node.effects.length > 0) {
    const shadows = [];
    node.effects.forEach(effect => {
      if (effect.type === 'DROP_SHADOW' && effect.visible !== false) {
        const x = effect.offset?.x || 0;
        const y = effect.offset?.y || 0;
        const blur = effect.radius || 0;
        const spread = effect.spread || 0;
        const color = rgba(effect.color);
        shadows.push(`${x}px ${y}px ${blur}px ${spread}px ${color}`);
      }
      if (effect.type === 'BACKGROUND_BLUR' && effect.visible !== false) {
        css.backdropFilter = `blur(${effect.radius}px)`;
      }
    });
    if (shadows.length > 0) {
      css.boxShadow = shadows.join(', ');
    }
  }
  
  // Typography
  if (node.style) {
    const s = node.style;
    if (s.fontFamily) css.fontFamily = `"${s.fontFamily}", -apple-system, BlinkMacSystemFont, sans-serif`;
    if (s.fontSize) css.fontSize = `${s.fontSize}px`;
    if (s.fontWeight) css.fontWeight = s.fontWeight;
    if (s.lineHeightPx) {
      css.lineHeight = `${s.lineHeightPx}px`;
    } else if (s.lineHeightPercent) {
      css.lineHeight = `${s.lineHeightPercent}%`;
    }
    if (s.letterSpacing) css.letterSpacing = `${s.letterSpacing}px`;
    if (s.textAlignHorizontal) {
      css.textAlign = s.textAlignHorizontal.toLowerCase();
    }
  }
  
  // Layout (Auto Layout)
  if (node.layoutMode) {
    css.display = 'flex';
    css.flexDirection = node.layoutMode === 'VERTICAL' ? 'column' : 'row';
    
    // Alignment
    const alignMain = {
      'MIN': 'flex-start',
      'CENTER': 'center',
      'MAX': 'flex-end',
      'SPACE_BETWEEN': 'space-between'
    };
    const alignCross = {
      'MIN': 'flex-start',
      'CENTER': 'center',
      'MAX': 'flex-end',
      'STRETCH': 'stretch'
    };
    
    if (node.primaryAxisAlignItems) {
      css.justifyContent = alignMain[node.primaryAxisAlignItems] || 'flex-start';
    }
    if (node.counterAxisAlignItems) {
      css.alignItems = alignCross[node.counterAxisAlignItems] || 'flex-start';
    }
    
    // Gap
    if (node.itemSpacing !== undefined) {
      css.gap = `${node.itemSpacing}px`;
    }
  }
  
  // Padding
  const pt = node.paddingTop || 0;
  const pr = node.paddingRight || 0;
  const pb = node.paddingBottom || 0;
  const pl = node.paddingLeft || 0;
  if (pt || pr || pb || pl) {
    if (pt === pr && pr === pb && pb === pl) {
      css.padding = `${pt}px`;
    } else {
      css.padding = `${pt}px ${pr}px ${pb}px ${pl}px`;
    }
  }
  
  return css;
}

// Generate SCSS output
let scss = `// Auto-generated from ${path.basename(jsonFile)}\n`;
scss += `// Generated on ${new Date().toISOString()}\n\n`;

// Group nodes by hierarchy
const rootNodes = data.filter(n => n.type === 'FRAME' && !n.name.startsWith('Frame 10000'));
const resultItems = data.filter(n => n.name.startsWith('Frame 10000028'));

console.log(`📦 Found ${rootNodes.length} root frames`);
console.log(`📦 Found ${resultItems.length} result items\n`);

// Generate SCSS for each important component
scss += `// Main container (${data[0].rect.width}x${data[0].rect.height})\n`;
scss += `.${toClassName(data[0].name)} {\n`;
Object.entries(extractAllStyles(data[0])).forEach(([prop, val]) => {
  scss += `  ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${val};\n`;
});
scss += `}\n\n`;

// Generate for result items (they all share structure)
if (resultItems.length > 0) {
  scss += `// Result item (repeating structure)\n`;
  scss += `.result-item {\n`;
  Object.entries(extractAllStyles(resultItems[0])).forEach(([prop, val]) => {
    scss += `  ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${val};\n`;
  });
  scss += `}\n\n`;
}

// Output
if (outputFile) {
  fs.writeFileSync(outputFile, scss);
  console.log(`✅ SCSS written to: ${outputFile}\n`);
} else {
  console.log(scss);
}

console.log(`💡 To use: Copy the generated SCSS into your component file\n`);
