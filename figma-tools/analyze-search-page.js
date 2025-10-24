const fs = require('fs');

const data = JSON.parse(fs.readFileSync('figma-tools/figma-design.json', 'utf8'));

function findAllNodes(node, predicate, results = []) {
  if (predicate(node)) {
    results.push(node);
  }
  if (node.children) {
    node.children.forEach(child => findAllNodes(child, predicate, results));
  }
  return results;
}

// Find search page and related components
const searchNodes = findAllNodes(data.document, n => 
  n.name && (n.name.toLowerCase().includes('search') || n.name === 'Frame 1000002924')
);

const filterNodes = findAllNodes(data.document, n => 
  n.name && n.name.toLowerCase().includes('filter')
);

const resultCards = findAllNodes(data.document, n => 
  n.name && (n.name.includes('Card') || n.name.includes('result'))
);

console.log('=== SEARCH COMPONENT ===');
const searchComp = searchNodes.find(n => n.componentId === '1850:2249');
if (searchComp) {
  console.log('Search Bar:', {
    width: searchComp.absoluteBoundingBox?.width,
    height: searchComp.absoluteBoundingBox?.height,
    padding: searchComp.paddingLeft,
    gap: searchComp.itemSpacing,
    borderRadius: searchComp.cornerRadius,
    background: searchComp.fills?.[0]
  });
}

console.log('\n=== SEARCH RESULTS FRAME ===');
const resultsFrame = searchNodes.find(n => n.name === 'Frame 24' && n.absoluteBoundingBox?.width === 345);
if (resultsFrame) {
  console.log('Results Container:', {
    width: resultsFrame.absoluteBoundingBox.width,
    height: resultsFrame.absoluteBoundingBox.height,
    padding: resultsFrame.paddingTop,
    gap: resultsFrame.itemSpacing,
    children: resultsFrame.children?.map(c => ({
      name: c.name,
      type: c.type,
      text: c.characters,
      style: c.style
    }))
  });
}

console.log('\n=== FILTER COMPONENTS ===');
filterNodes.slice(0, 3).forEach(node => {
  console.log({
    name: node.name,
    type: node.type,
    size: node.absoluteBoundingBox,
    text: node.characters
  });
});

console.log('\n=== LEFT PANEL (393px) ===');
const leftPanel = searchNodes.find(n => n.name === 'Frame 1000002924');
if (leftPanel) {
  console.log('Panel Specs:', {
    width: leftPanel.absoluteBoundingBox?.width,
    height: leftPanel.absoluteBoundingBox?.height,
    padding: {
      top: leftPanel.paddingTop,
      right: leftPanel.paddingRight,
      bottom: leftPanel.paddingBottom,
      left: leftPanel.paddingLeft
    },
    gap: leftPanel.itemSpacing,
    background: leftPanel.backgroundColor,
    borderRadius: leftPanel.cornerRadius
  });
}
