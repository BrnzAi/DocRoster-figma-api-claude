const fs = require('fs');

const searchData = JSON.parse(fs.readFileSync('./search-layout.json', 'utf8'));

console.log('📋 All Ellipse 5 entries in search-layout.json:\n');

let count = 0;
const imageRefs = new Map();

searchData.forEach((item, idx) => {
  if (item.name === 'Ellipse 5' && item.type === 'ELLIPSE') {
    count++;
    const imageRef = item.fills && item.fills[0] && item.fills[0].imageRef;
    
    console.log(`${count}. Ellipse 5`);
    console.log(`   ID: ${item.id}`);
    console.log(`   imageRef: ${imageRef || 'NONE'}`);
    console.log(`   Position: x:${item.rect.x}, y:${item.rect.y}`);
    console.log('');
    
    if (imageRef) {
      if (!imageRefs.has(imageRef)) {
        imageRefs.set(imageRef, []);
      }
      imageRefs.get(imageRef).push(item.id);
    }
  }
});

console.log(`\nTotal: ${count} Ellipse 5 entries found`);
console.log(`Unique imageRefs: ${imageRefs.size}\n`);

console.log('ImageRef usage:');
imageRefs.forEach((ids, ref) => {
  console.log(`  ${ref}: used ${ids.length} times`);
});
