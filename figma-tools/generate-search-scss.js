/**
 * Generate SCSS from search-layout.json
 * This reads the Figma JSON export and generates exact CSS styles
 */

const fs = require('fs');
const path = require('path');

// Read the search layout JSON
const searchLayout = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'search-layout.json'), 'utf-8')
);

console.log('🎨 Generating SCSS from search-layout.json...\n');

// Helper: Convert Figma color to CSS rgba
function figmaColorToRgba(color, opacity = 1) {
  if (!color) return 'transparent';
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a !== undefined ? color.a * opacity : opacity;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Helper: Extract CSS properties from Figma node
function extractStyles(node) {
  const styles = {};
  
  // Dimensions
  if (node.rect) {
    styles.width = `${node.rect.width}px`;
    styles.height = `${node.rect.height}px`;
  }
  
  // Fills (background)
  if (node.fills && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      styles.background = figmaColorToRgba(fill.color, fill.opacity);
    }
  }
  
  // Strokes (border)
  if (node.strokes && node.strokes.length > 0) {
    const stroke = node.strokes[0];
    const strokeWeight = node.strokeWeight || 1;
    if (stroke.type === 'SOLID') {
      styles.border = `${strokeWeight}px solid ${figmaColorToRgba(stroke.color, stroke.opacity)}`;
    }
  }
  
  // Corner radius
  if (node.cornerRadius) {
    styles.borderRadius = `${node.cornerRadius}px`;
  }
  
  // Effects (shadows, blur)
  if (node.effects && node.effects.length > 0) {
    node.effects.forEach(effect => {
      if (effect.type === 'DROP_SHADOW') {
        const x = effect.offset?.x || 0;
        const y = effect.offset?.y || 0;
        const blur = effect.radius || 0;
        const spread = effect.spread || 0;
        const color = figmaColorToRgba(effect.color, 1);
        styles.boxShadow = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
      }
      if (effect.type === 'BACKGROUND_BLUR') {
        styles.backdropFilter = `blur(${effect.radius}px)`;
      }
    });
  }
  
  // Text styles
  if (node.style) {
    const textStyle = node.style;
    if (textStyle.fontFamily) styles.fontFamily = `"${textStyle.fontFamily}"`;
    if (textStyle.fontSize) styles.fontSize = `${textStyle.fontSize}px`;
    if (textStyle.fontWeight) styles.fontWeight = textStyle.fontWeight;
    if (textStyle.lineHeightPercent) {
      styles.lineHeight = `${textStyle.lineHeightPercent}%`;
    }
    if (textStyle.letterSpacing) {
      styles.letterSpacing = `${textStyle.letterSpacing}px`;
    }
    if (textStyle.textAlignHorizontal) {
      styles.textAlign = textStyle.textAlignHorizontal.toLowerCase();
    }
  }
  
  // Layout properties
  if (node.layoutMode) {
    styles.display = 'flex';
    styles.flexDirection = node.layoutMode === 'VERTICAL' ? 'column' : 'row';
  }
  
  if (node.primaryAxisAlignItems) {
    const mapping = {
      'MIN': 'flex-start',
      'CENTER': 'center',
      'MAX': 'flex-end',
      'SPACE_BETWEEN': 'space-between'
    };
    styles.justifyContent = mapping[node.primaryAxisAlignItems] || 'flex-start';
  }
  
  if (node.counterAxisAlignItems) {
    const mapping = {
      'MIN': 'flex-start',
      'CENTER': 'center',
      'MAX': 'flex-end'
    };
    styles.alignItems = mapping[node.counterAxisAlignItems] || 'flex-start';
  }
  
  if (node.itemSpacing) {
    styles.gap = `${node.itemSpacing}px`;
  }
  
  if (node.paddingTop || node.paddingRight || node.paddingBottom || node.paddingLeft) {
    const pt = node.paddingTop || 0;
    const pr = node.paddingRight || 0;
    const pb = node.paddingBottom || 0;
    const pl = node.paddingLeft || 0;
    styles.padding = `${pt}px ${pr}px ${pb}px ${pl}px`;
  }
  
  return styles;
}

// Generate SCSS for a node
function generateScss(node, indent = 0) {
  const spaces = '  '.repeat(indent);
  const className = node.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  const styles = extractStyles(node);
  
  let scss = `${spaces}// ${node.name} (${node.type})\n`;
  scss += `${spaces}.${className} {\n`;
  
  Object.entries(styles).forEach(([prop, value]) => {
    const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
    scss += `${spaces}  ${cssProp}: ${value};\n`;
  });
  
  scss += `${spaces}}\n\n`;
  
  return scss;
}

// Find key components
const components = {
  'Frame 1000002924': null, // Main frame
  'Frame 1000002863': null, // Top section
  'Group 144': null, // Profile avatar
  'Frame 8': null, // Profile button
  'search_box': null, // Search box
};

// Parse all nodes
searchLayout.forEach(node => {
  if (components.hasOwnProperty(node.name)) {
    components[node.name] = node;
  }
  
  // Print all for inspection
  console.log(`📦 ${node.name} (${node.type})`);
  if (node.rect) {
    console.log(`   Size: ${node.rect.width}x${node.rect.height}px`);
  }
  console.log(generateScss(node, 0));
});

console.log('\n✅ SCSS generation complete!\n');
console.log('💡 TIP: Review the output above and copy relevant styles to your .scss file');
